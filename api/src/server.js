require('dotenv').config();
const path   = require('path');
const fs     = require('fs');
const app    = require('./app');
const logger = require('./utils/logger');

function validateEnv() {
    process.env.NODE_ENV = process.env.NODE_ENV || 'development';
    process.env.PORT     = process.env.PORT     || '5001';
}
validateEnv();

const initCron = require('./services/cronService');

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
    logger.info(`API running on http://localhost:${PORT}`);

    initCron();

    // Safety Net: purge stale upload/output files every hour
    setInterval(() => {
        logger.debug('Running scheduled file cleanup');
        const dirs = [
            path.join(__dirname, '../uploads'),
            path.join(__dirname, '../output'),
        ];
        dirs.forEach(dir => {
            if (!fs.existsSync(dir)) return;
            fs.readdir(dir, (err, files) => {
                if (err) { logger.error('Failed to read dir for cleanup', { dir, error: err.message }); return; }
                const now = Date.now();
                files.forEach(file => {
                    const filePath = path.join(dir, file);
                    fs.stat(filePath, (statErr, stats) => {
                        if (statErr) return;
                        if (now - stats.mtimeMs > 30 * 60 * 1000) {
                            fs.unlink(filePath, () => logger.debug('Deleted stale file', { file }));
                        }
                    });
                });
            });
        });
    }, 60 * 60 * 1000);
});
