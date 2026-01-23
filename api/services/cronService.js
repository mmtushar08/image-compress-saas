const cron = require('node-cron');
const db = require('./db');

const initCron = () => {
    console.log('⏰ Initializing Cron Jobs...');

    // Run at Midnight UTC every day (0 0 * * *)
    cron.schedule('0 0 * * *', () => {
        console.log('🔄 Running Nightly Reset Job...');

        try {
            // Reset dailyUsage for ALL users
            // Note: We reset for everyone to be safe, or we could filter by plan.
            // Since dailyUsage is only relevant for limiting, resetting it for everyone is fine.
            // It also resets guest limits which are in-memory (handled separately in userController), 
            // but this DB reset handles registered users.

            const info = db.prepare('UPDATE users SET dailyUsage = 0').run();

            console.log(`✅ Daily usage reset complete. Updated ${info.changes} users.`);

        } catch (error) {
            console.error('❌ Nightly Reset Job Failed:', error);
        }
    }, {
        timezone: "Etc/UTC"
    });

    // Run at Start of Month (0 0 1 * *)
    cron.schedule('0 0 1 * *', () => {
        console.log('📅 Running Monthly Usage Reset Job...');
        try {
            const info = db.prepare('UPDATE users SET usage = 0').run();
            console.log(`✅ Monthly usage reset complete. Updated ${info.changes} users.`);
        } catch (error) {
            console.error('❌ Monthly Reset Job Failed:', error);
        }
    }, {
        timezone: "Etc/UTC"
    });

    console.log('✅ Cron Jobs Scheduled (Midnight UTC)');
};

module.exports = initCron;
