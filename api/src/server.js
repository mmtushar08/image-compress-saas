require('dotenv').config();
const path   = require('path');
const fs     = require('fs');
const app    = require('./app');
const logger = require('./utils/logger');
const { runMigrations } = require('./db/migrate');

function validateEnv() {
    process.env.NODE_ENV = process.env.NODE_ENV || 'development';
    process.env.PORT     = process.env.PORT     || '5001';
}
validateEnv();

const initCron = require('./services/cronService');

const PORT = process.env.PORT || 5001;
let server;

// Run migrations before accepting traffic, then start the server.
runMigrations()
    .then(() => {
        server = app.listen(PORT, '0.0.0.0', () => {
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
    })
    .catch((err) => {
        logger.error('Fatal: could not start server (migrations failed)', { error: err.message });
        process.exit(1);
    });

// Graceful shutdown — drain in-flight requests before exiting (containers/PM2 send SIGTERM)
const shutdown = (signal) => {
    logger.info(`Received ${signal}, shutting down gracefully`);
    if (!server) process.exit(0);
    server.close((err) => {
        if (err) {
            logger.error('Error during server close', { error: err.message });
            process.exit(1);
        }
        logger.info('HTTP server closed, exiting');
        process.exit(0);
    });
    // Force-exit if connections do not drain in time
    setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
    }, 10000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));
