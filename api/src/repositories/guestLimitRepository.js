/**
 * guestLimitRepository — all `guest_limits` table access.
 * Persists per-IP guest usage so limits survive restarts and are shared
 * across workers (replaces the old in-memory Map).
 */
const knex = require('../db');

const TABLE = 'guest_limits';

const findByIp = (ip) => knex(TABLE).where({ ip }).first();

/**
 * Increment today's count for an IP. If the stored row is from a previous day
 * (or absent), reset to 1 for today. Read-then-write keeps this portable across
 * SQLite and Postgres without dialect-specific UPSERT CASE expressions.
 */
const increment = async (ip, today) => {
    const row = await findByIp(ip);
    if (!row) {
        await knex(TABLE).insert({ ip, count: 1, date: today });
    } else if (row.date === today) {
        await knex(TABLE).where({ ip }).update({ count: row.count + 1 });
    } else {
        await knex(TABLE).where({ ip }).update({ count: 1, date: today });
    }
};

// Cron: drop rows older than today.
const purgeBefore = (today) => knex(TABLE).where('date', '<', today).del();

module.exports = { findByIp, increment, purgeBefore };
