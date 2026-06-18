/**
 * apiKeyRepository — all `api_keys` table access.
 */
const knex = require('../db');

const TABLE = 'api_keys';

const findActiveByIndex = (keyIndex) =>
    knex(TABLE).where({ keyIndex, status: 'active' }).first();

// Legacy keys created before the SHA-256 keyIndex existed (bcrypt fallback path).
const findActiveLegacyKeys = () =>
    knex(TABLE).whereNull('keyIndex').andWhere({ status: 'active' }).select('*');

const create = (key) => knex(TABLE).insert(key);

const updateLastUsed = (id, isoDate) =>
    knex(TABLE).where({ id }).update({ lastUsedAt: isoDate });

const findActivePrefixByUserId = (userId) =>
    knex(TABLE).where({ userId, status: 'active' }).select('prefix').first();

module.exports = {
    findActiveByIndex,
    findActiveLegacyKeys,
    create,
    updateLastUsed,
    findActivePrefixByUserId,
};
