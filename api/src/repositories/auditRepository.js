/**
 * auditRepository — append-only access to the `audit_log` table.
 */
const crypto = require('crypto');
const knex = require('../db');

const TABLE = 'audit_log';

const record = (entry) =>
    knex(TABLE).insert({
        id:         crypto.randomUUID(),
        createdAt:  new Date().toISOString(),
        actorType:  entry.actorType || null,
        actorId:    entry.actorId   || null,
        action:     entry.action,
        targetType: entry.targetType || null,
        targetId:   entry.targetId   || null,
        ip:         entry.ip || null,
        metadata:   entry.metadata ? JSON.stringify(entry.metadata) : null,
    });

const list = async ({ action = '', actorId = '', limit = 100, offset = 0 } = {}) => {
    const q = knex(TABLE).select('*');
    if (action)  q.where({ action });
    if (actorId) q.andWhere({ actorId });
    return q.orderBy('createdAt', 'desc').limit(limit).offset(offset);
};

module.exports = { record, list };
