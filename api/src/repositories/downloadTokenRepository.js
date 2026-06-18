/**
 * downloadTokenRepository — all `download_tokens` table access.
 */
const knex = require('../db');

const TABLE = 'download_tokens';

const create = ({ token, filename, userId, ip, expiresAt }) =>
    knex(TABLE).insert({ token, filename, userId: userId || null, ip: ip || null, expiresAt, used: 0 });

const findByToken = (token) => knex(TABLE).where({ token }).first();

const markUsed = (token) => knex(TABLE).where({ token }).update({ used: 1 });

// Cron: drop expired or already-used tokens. Returns rows deleted.
const purgeExpiredOrUsed = (nowIso) =>
    knex(TABLE).where('expiresAt', '<', nowIso).orWhere({ used: 1 }).del();

module.exports = { create, findByToken, markUsed, purgeExpiredOrUsed };
