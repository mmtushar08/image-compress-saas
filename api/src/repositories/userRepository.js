/**
 * userRepository — all `users` table access. Controllers/services call these
 * instead of writing SQL, so the data layer is swappable (SQLite ⇄ Postgres)
 * and individually testable.
 */
const knex = require('../db');

const TABLE = 'users';

const findById          = (id)    => knex(TABLE).where({ id }).first();
const findByEmail       = (email) => knex(TABLE).where({ email }).first();
const findBySessionToken = (sessionToken) => knex(TABLE).where({ sessionToken }).first();

const findByMagicToken = (magicToken, email) =>
    knex(TABLE).where({ magicToken, email }).first();

const create = (user) => knex(TABLE).insert(user);

const updateById      = (id, fields)       => knex(TABLE).where({ id }).update(fields);
const updateByEmail   = (email, fields)    => knex(TABLE).where({ email }).update(fields);
const clearSession    = (sessionToken)     => knex(TABLE).where({ sessionToken })
    .update({ sessionToken: null, sessionExpiry: null });

// Atomic counter updates (?? lets Knex quote the column per dialect)
const incrementUsage = (id, isoDate) =>
    knex(TABLE).where({ id }).update({ usage: knex.raw('?? + 1', ['usage']), lastUsedDate: isoDate });

const decrementCredits = (id, isoDate) =>
    knex(TABLE).where({ id }).update({ credits: knex.raw('?? - 1', ['credits']), lastUsedDate: isoDate });

const incrementDailyUsage = (id, isoDate) =>
    knex(TABLE).where({ id }).update({ dailyUsage: knex.raw('?? + 1', ['dailyUsage']), lastUsedDate: isoDate });

// --- Cron resets ---
const resetDailyUsage   = () => knex(TABLE).update({ dailyUsage: 0 });
const resetMonthlyUsage = () => knex(TABLE).update({ usage: 0 });

// --- Admin aggregations ---
const countAll = async () => {
    const row = await knex(TABLE).count({ count: '*' }).first();
    return Number(row.count);
};

const planBreakdown = () =>
    knex(TABLE).select('plan').count({ count: '*' }).groupBy('plan');

const totalCompressions = async () => {
    const row = await knex(TABLE).sum({ total: 'usage' }).first();
    return Number(row.total) || 0;
};

const countActiveSince = async (isoDate) => {
    const row = await knex(TABLE).where('lastUsedDate', '>', isoDate).count({ count: '*' }).first();
    return Number(row.count);
};

const countCreatedSince = async (isoDate) => {
    const row = await knex(TABLE).where('createdAt', '>', isoDate).count({ count: '*' }).first();
    return Number(row.count);
};

/**
 * Paginated/filtered user list for the admin panel.
 * Returns { users, total }.
 */
const listUsers = async ({ search = '', plan = '', limit = 50, offset = 0 }) => {
    const applyFilters = (q) => {
        if (search) q.where('email', 'like', `%${search}%`);
        if (plan)   q.andWhere({ plan });
        return q;
    };

    const users = await applyFilters(knex(TABLE).select('*'))
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .offset(offset);

    const countRow = await applyFilters(knex(TABLE).count({ count: '*' })).first();

    return { users, total: Number(countRow.count) };
};

module.exports = {
    findById,
    findByEmail,
    findBySessionToken,
    findByMagicToken,
    create,
    updateById,
    updateByEmail,
    clearSession,
    incrementUsage,
    decrementCredits,
    incrementDailyUsage,
    resetDailyUsage,
    resetMonthlyUsage,
    countAll,
    planBreakdown,
    totalCompressions,
    countActiveSince,
    countCreatedSince,
    listUsers,
};
