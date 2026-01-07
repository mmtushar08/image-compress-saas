const { Client } = require('ssh2');

const CONFIG = {
    host: '62.72.57.16',
    username: 'root',
    password: 'cVbaM/g(UpP?WCU/f@9#',
};

const conn = new Client();
conn.on('ready', () => {
    // We need to trigger the error first to generate logs, but I assume the user already triggered it.
    // However, the node app logs to stdout/stderr. PM2 should have captured it.
    // 'pm2 logs' only shows tail.
    // Let's try to get more lines or look for the specific error in the log file directly.
    // Also, the engineService logs "[Engine Stderr]:" so it should be in PM2 logs.

    const cmd = `cat /root/.pm2/logs/trimixo-api-error.log && cat /root/.pm2/logs/trimixo-api-out.log`;

    conn.exec(cmd, (err, stream) => {
        if (err) throw err;
        stream.on('close', () => conn.end());
        stream.on('data', d => console.log('LOG: ' + d));
        stream.stderr.on('data', d => console.error('ERR: ' + d));
    });
}).on('error', (err) => console.error(err)).connect(CONFIG);
