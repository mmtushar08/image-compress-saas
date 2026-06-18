const cron   = require('node-cron');
const logger = require('../utils/logger');
const userRepo  = require('../repositories/userRepository');
const guestRepo = require('../repositories/guestLimitRepository');
const downloadTokenRepo = require('../repositories/downloadTokenRepository');

const initCron = () => {
    logger.info('Initializing cron jobs');

    // Daily reset — midnight UTC
    cron.schedule('0 0 * * *', async () => {
        logger.info('Running nightly reset job');
        try {
            const changes = await userRepo.resetDailyUsage();
            const today = new Date().toISOString().split('T')[0];
            await guestRepo.purgeBefore(today);
            logger.info('Nightly reset complete', { usersReset: changes });
        } catch (error) {
            logger.error('Nightly reset job failed', { error: error.message, stack: error.stack });
        }
    }, { timezone: 'Etc/UTC' });

    // Monthly reset — 1st of month, midnight UTC
    cron.schedule('0 0 1 * *', async () => {
        logger.info('Running monthly usage reset job');
        try {
            const changes = await userRepo.resetMonthlyUsage();
            logger.info('Monthly reset complete', { usersReset: changes });
        } catch (error) {
            logger.error('Monthly reset job failed', { error: error.message, stack: error.stack });
        }
    }, { timezone: 'Etc/UTC' });

    // Purge expired/used download tokens — every hour
    cron.schedule('0 * * * *', async () => {
        try {
            const count = await downloadTokenRepo.purgeExpiredOrUsed(new Date().toISOString());
            if (count > 0) {
                logger.debug('Purged expired download tokens', { count });
            }
        } catch (error) {
            logger.error('Download token purge failed', { error: error.message });
        }
    });

    logger.info('Cron jobs scheduled');
};

module.exports = initCron;
