const cron   = require('node-cron');
const db     = require('./db');
const logger = require('../utils/logger');

const initCron = () => {
    logger.info('Initializing cron jobs');

    // Daily reset — midnight UTC
    cron.schedule('0 0 * * *', () => {
        logger.info('Running nightly reset job');
        try {
            const info = db.prepare('UPDATE users SET dailyUsage = 0').run();
            // Also purge expired guest_limits rows older than today
            const today = new Date().toISOString().split('T')[0];
            db.prepare("DELETE FROM guest_limits WHERE date < ?").run(today);
            logger.info('Nightly reset complete', { usersReset: info.changes });
        } catch (error) {
            logger.error('Nightly reset job failed', { error: error.message, stack: error.stack });
        }
    }, { timezone: 'Etc/UTC' });

    // Monthly reset — 1st of month, midnight UTC
    cron.schedule('0 0 1 * *', () => {
        logger.info('Running monthly usage reset job');
        try {
            const info = db.prepare('UPDATE users SET usage = 0').run();
            logger.info('Monthly reset complete', { usersReset: info.changes });
        } catch (error) {
            logger.error('Monthly reset job failed', { error: error.message, stack: error.stack });
        }
    }, { timezone: 'Etc/UTC' });

    // Purge expired download tokens — every hour
    cron.schedule('0 * * * *', () => {
        try {
            const info = db.prepare("DELETE FROM download_tokens WHERE expiresAt < ? OR used = 1")
                .run(new Date().toISOString());
            if (info.changes > 0) {
                logger.debug('Purged expired download tokens', { count: info.changes });
            }
        } catch (error) {
            logger.error('Download token purge failed', { error: error.message });
        }
    });

    logger.info('Cron jobs scheduled');
};

module.exports = initCron;
