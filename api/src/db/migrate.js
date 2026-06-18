/**
 * Run pending migrations. Called at server startup and by the test bootstrap
 * so the schema is always current before any query runs.
 */
const knex   = require('./index');
const logger = require('../utils/logger');

async function runMigrations() {
    try {
        const [batch, applied] = await knex.migrate.latest();
        if (applied.length === 0) {
            logger.info('DB schema up to date — no migrations applied');
        } else {
            logger.info('DB migrations applied', { batch, count: applied.length });
        }
    } catch (err) {
        logger.error('DB migration failed', { error: err.message, stack: err.stack });
        throw err;
    }
}

module.exports = { runMigrations };
