const { Client } = require('ssh2');

const CONFIG = {
    host: '62.72.57.16',
    username: 'root',
    password: 'cVbaM/g(UpP?WCU/f@9#',
};

const conn = new Client();
conn.on('ready', () => {
    console.log('Client :: ready');
    // Fetch last 50 lines of error logs
    conn.exec('pm2 logs trimixo-api --err --lines 50 --nostream', (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
            conn.end();
        }).on('data', (data) => {
            console.log('STDOUT: ' + data);
        }).stderr.on('data', (data) => {
            console.log('STDERR: ' + data);
        });
    });
}).on('error', (err) => {
    console.error('Connection Error:', err);
}).connect(CONFIG);
