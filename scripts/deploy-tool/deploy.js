const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const CONFIG = {
    host: '62.72.57.16',
    username: 'root',
    password: 'cVbaM/g(UpP?WCU/f@9#',
    remoteDir: '/root/app',
};

const commands = [
    // 1. Prepare System
    'apt-get update',
    'apt-get install -y curl unzip git',

    // 2. Install Node.js 20
    'curl -fsSL https://deb.nodesource.com/setup_20.x | bash -',
    'apt-get install -y nodejs',

    // 3. Install Docker
    'curl -fsSL https://get.docker.com | sh',

    // 4. Install Nginx
    'apt-get install -y nginx',

    // 5. Clean Previous Deployment
    `rm -rf ${CONFIG.remoteDir}`,
    `mkdir -p ${CONFIG.remoteDir}`,
];

const setupCommands = [
    // 6. Unzip
    `tar -xzf ${CONFIG.remoteDir}/deploy.tar.gz -C ${CONFIG.remoteDir}`,

    // 7. Install Dependencies
    `mkdir -p ${CONFIG.remoteDir}/api/uploads`,
    `cd ${CONFIG.remoteDir}/api && npm install`,
    `cd ${CONFIG.remoteDir}/client && npm install`,

    // 8. Build Frontend
    `cd ${CONFIG.remoteDir}/client && npm run build`,

    // 9. Move Frontend config
    `rm -rf /var/www/trimixo`,
    `mkdir -p /var/www/trimixo`,
    `cp -r ${CONFIG.remoteDir}/client/dist/* /var/www/trimixo/`,

    // 10. Build Docker Engine
    `cd ${CONFIG.remoteDir}/engine && docker build -t img-compress-engine .`,

    // 11. Configure Nginx
    `rm -f /etc/nginx/sites-enabled/smartcompress`, // Remove old if exists
    `rm -f /etc/nginx/sites-enabled/trimixo`,
    `cp ${CONFIG.remoteDir}/scripts/deploy-tool/nginx.conf /etc/nginx/sites-available/trimixo`,
    `ln -sf /etc/nginx/sites-available/trimixo /etc/nginx/sites-enabled/`,
    `nginx -t && systemctl reload nginx`,

    // 12. Setup PM2 & Start API
    `npm install -g pm2`,
    `cd ${CONFIG.remoteDir}/api && echo "PORT=5000" > .env`,
    `pm2 stop smartcompress-api || true`, // Stop old name
    `pm2 stop trimixo-api || true`,
    `cd ${CONFIG.remoteDir}/api && pm2 start server.js --name trimixo-api`,
    `pm2 save`,
];

async function runDeploy() {
    try {
        console.log('📦 Using existing deploy.tar.gz...');

        console.log('🚀 Connecting to VPS...');
        const conn = new Client();

        conn.on('ready', () => {
            console.log('✅ Connected!');

            // 1. Run Initial Setup
            console.log('⚙️  Running System Setup (this may take a while)...');
            const setupCmd =
                'export DEBIAN_FRONTEND=noninteractive && ' + commands.join(' && ');

            conn.exec(setupCmd, (err, stream) => {
                if (err) throw err;

                stream
                    .on('close', (code, signal) => {
                        if (code !== 0) {
                            console.error('❌ System Setup Failed');
                            conn.end();
                            return;
                        }
                        console.log('✅ System Setup Complete');

                        // 2. Upload File
                        console.log('📤 Uploading deployment archive...');
                        conn.sftp((err, sftp) => {
                            if (err) throw err;

                            const localPath = path.join(__dirname, 'deploy.tar.gz');
                            const remotePath = `${CONFIG.remoteDir}/deploy.tar.gz`;

                            sftp.fastPut(localPath, remotePath, (err) => {
                                if (err) throw err;
                                console.log('✅ Upload Complete');

                                // 3. Run Application Setup
                                console.log('🏗️  Building and Deploying Application...');
                                const appCmd =
                                    'export DEBIAN_FRONTEND=noninteractive && ' +
                                    setupCommands.join(' && ');

                                conn.exec(appCmd, (err, stream) => {
                                    if (err) throw err;
                                    stream.on('data', (d) => console.log('REMOTE: ' + d));
                                    stream.stderr.on('data', (d) =>
                                        console.log('REMOTE ERR: ' + d)
                                    );

                                    stream.on('close', (code) => {
                                        conn.end();
                                        if (code === 0) {
                                            console.log('✨ Deployment Successful!');
                                            console.log('🌍 Live at http://' + CONFIG.host);
                                            process.exit(0);
                                        } else {
                                            console.error('❌ Deployment Failed with code ' + code);
                                            process.exit(1);
                                        }
                                    });
                                });
                            });
                        });
                    })
                    .on('data', (data) => console.log('SETUP: ' + data))
                    .stderr.on('data', (data) => console.log('SETUP ERR: ' + data));
            });
        })
            .on('error', (err) => {
                console.error('Connection Failed:', err);
            })
            .connect({
                host: CONFIG.host,
                port: 22,
                username: CONFIG.username,
                password: CONFIG.password,
                readyTimeout: 20000,
                keepaliveInterval: 5000
            });
    } catch (error) {
        console.error('Deployment Script Error:', error);
    }
}

runDeploy();
