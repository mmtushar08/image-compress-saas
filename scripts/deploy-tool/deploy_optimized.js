require('dotenv').config({ path: path.join(__dirname, '..', '..', 'api', '.env') });
const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const config = {
    host: process.env.VPS_HOST,
    port: process.env.VPS_PORT || 22,
    username: process.env.VPS_USER || 'root',
    password: process.env.VPS_PASSWORD
};

if (!config.host || !config.password) {
    console.error('❌ Error: Missing VPS credentials in .env file');
    console.error('Required variables: VPS_HOST, VPS_PASSWORD');
    process.exit(1);
}

const PROJECT_ROOT = path.join(__dirname, '..', '..');
const REMOTE_PATH = '/var/www/shrinkix';

console.log('🚀 Optimized Deployment Script');
console.log('================================\n');

// Step 1: Build frontend locally
console.log('📦 Step 1: Building frontend locally...');
const { execSync } = require('child_process');

try {
    execSync('npm run build', {
        cwd: path.join(PROJECT_ROOT, 'client'),
        stdio: 'inherit'
    });
    console.log('✅ Frontend built successfully!\n');
} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}

// Step 2: Create archive with only necessary files
console.log('📂 Step 2: Creating deployment archive...');
const archivePath = path.join(__dirname, 'deploy-optimized.tar.gz');
const output = fs.createWriteStream(archivePath);
const archive = archiver('tar', { gzip: true });

output.on('close', () => {
    console.log(`✅ Archive created: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB\n`);
    uploadAndDeploy();
});

archive.on('error', (err) => {
    console.error('❌ Archive error:', err);
    process.exit(1);
});

archive.pipe(output);

// Add only the dist folder (frontend build)
archive.directory(path.join(PROJECT_ROOT, 'client', 'dist'), 'client/dist');

// Add API files but EXCLUDE node_modules (will use existing on server)
archive.glob('**/*', {
    cwd: path.join(PROJECT_ROOT, 'api'),
    ignore: [
        'node_modules/**',
        'uploads/**',
        'output/**',
        '*.log',
        'data/**',
        'tests/**',      // Exclude tests
        '**/*.test.js',  // Exclude test files
        '**/*.spec.js'
    ]
}, { prefix: 'api' });

archive.finalize();

// Step 3: Upload and deploy
function uploadAndDeploy() {
    console.log('📤 Step 3: Uploading to server...');

    const conn = new Client();

    conn.on('ready', () => {
        console.log('✅ Connected to VPS\n');

        // Upload the archive
        conn.sftp((err, sftp) => {
            if (err) {
                console.error('❌ SFTP error:', err);
                conn.end();
                return;
            }

            const remoteArchive = '/tmp/deploy-optimized.tar.gz';
            const readStream = fs.createReadStream(archivePath);
            const writeStream = sftp.createWriteStream(remoteArchive);

            readStream.pipe(writeStream);

            writeStream.on('close', () => {
                console.log('✅ Archive uploaded\n');

                // Extract and setup
                console.log('🔧 Step 4: Extracting and configuring...');

                const commands = [
                    // Backup current frontend
                    `mkdir -p ${REMOTE_PATH}/backups`,
                    `tar -czf ${REMOTE_PATH}/backups/client-dist-$(date +%Y%m%d-%H%M%S).tar.gz -C ${REMOTE_PATH}/client dist 2>/dev/null || true`,

                    // Extract new files
                    `cd ${REMOTE_PATH}`,
                    `tar -xzf /tmp/deploy-optimized.tar.gz`,

                    // Remove client node_modules if exists (free up space)
                    `echo "🗑️  Removing unnecessary client node_modules..."`,
                    `rm -rf ${REMOTE_PATH}/client/node_modules`,

                    // Ensure backend node_modules exists
                    `echo "✅ Checking backend dependencies..."`,
                    `cd ${REMOTE_PATH}/api && npm install --production 2>&1 | tail -5`,

                    // Restart backend
                    `echo "🔄 Restarting services..."`,
                    `pm2 restart api || pm2 start server.js --name api`,

                    // Reload nginx
                    `systemctl reload nginx`,

                    // Cleanup
                    `rm /tmp/deploy-optimized.tar.gz`,
                    `rm -rf ${REMOTE_PATH}/api/tests`, // Remove tests from server
                    `rm -rf ${REMOTE_PATH}/client/tests`, // Remove tests from server

                    // Show disk usage
                    `echo ""`,
                    `echo "💾 Disk usage:"`,
                    `du -sh ${REMOTE_PATH}/client/dist`,
                    `du -sh ${REMOTE_PATH}/api/node_modules`,
                    `echo ""`,
                    `echo "✨ Deployment complete!"`
                ].join(' && ');

                conn.exec(commands, (err, stream) => {
                    if (err) {
                        console.error('❌ Deployment error:', err);
                        conn.end();
                        return;
                    }

                    stream.on('data', (data) => {
                        process.stdout.write(data.toString());
                    });

                    stream.stderr.on('data', (data) => {
                        process.stderr.write(data.toString());
                    });

                    stream.on('close', (code) => {
                        conn.end();

                        // Cleanup local archive
                        fs.unlinkSync(archivePath);

                        if (code === 0) {
                            console.log('\n🎉 Deployment successful!');
                            console.log('🌐 Your site is now live with the latest changes.');
                            console.log('\n📊 Summary:');
                            console.log('  ✅ Frontend built and deployed (dist folder only)');
                            console.log('  ✅ Backend files updated');
                            console.log('  ✅ Client node_modules removed (space saved!)');
                            console.log('  ✅ Backend node_modules intact');
                            console.log('  ✅ Services restarted');
                        } else {
                            console.error(`\n❌ Deployment failed with code ${code}`);
                            process.exit(1);
                        }
                    });
                });
            });
        });
    });

    conn.on('error', (err) => {
        console.error('❌ Connection error:', err.message);
        process.exit(1);
    });

    conn.connect(config);
}
