const crypto = require('crypto');
const bcrypt = require('bcrypt');
const db = require('./db');
const logger = require('../utils/logger');

const GUEST_DAILY_LIMIT = 25;

// --- API Key helpers ---

const computeKeyIndex = (rawKey) =>
    crypto.createHash('sha256').update(rawKey).digest('hex');

const parseUser = (user) => {
    if (!user) return null;
    return {
        ...user,
        invoiceDetails: user.invoiceDetails ? JSON.parse(user.invoiceDetails) : {},
        webLimit:    Number(user.webLimit),
        apiCredits:  Number(user.apiCredits),
        usage:       Number(user.usage),
        dailyUsage:  Number(user.dailyUsage),
        credits:     Number(user.credits),
    };
};

// O(1) fast path via SHA-256 index; falls back to bcrypt loop for legacy keys
const findKeyByIndex = (providedKey) => {
    const idx = computeKeyIndex(providedKey);
    const byIndex = db.prepare(
        "SELECT * FROM api_keys WHERE keyIndex = ? AND status = 'active'"
    ).get(idx);
    if (byIndex) return byIndex;

    // Legacy keys (no keyIndex) — shrinks over time as users regenerate keys
    const legacyKeys = db.prepare(
        "SELECT * FROM api_keys WHERE keyIndex IS NULL AND status = 'active'"
    ).all();
    for (const k of legacyKeys) {
        try {
            if (bcrypt.compareSync(providedKey, k.keyHash)) return k;
        } catch (_) {}
    }
    return null;
};

const checkLimit = (providedKey) => {
    const matchedKey = findKeyByIndex(providedKey);
    if (!matchedKey) return { allowed: false, user: null };

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(matchedKey.userId);
    if (!user) return { allowed: false, user: null };

    const parsedUser = parseUser(user);
    let allowed = false;
    let error = null;

    if (parsedUser.usage < parsedUser.apiCredits) {
        allowed = true;
    } else if (parsedUser.credits > 0) {
        allowed = true;
    } else {
        error = 'Monthly limit reached and no credits available';
    }

    return { allowed, user: parsedUser, error };
};

const incrementUsage = (providedKey) => {
    const matchedKey = findKeyByIndex(providedKey);
    if (!matchedKey) return;

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(matchedKey.userId);
    if (!user) return;

    const parsedUser = parseUser(user);
    const now = new Date().toISOString();

    db.prepare('UPDATE api_keys SET lastUsedAt = ? WHERE id = ?').run(now, matchedKey.id);

    if (parsedUser.usage < parsedUser.apiCredits) {
        db.prepare('UPDATE users SET usage = usage + 1, lastUsedDate = ? WHERE id = ?')
            .run(now, matchedKey.userId);
    } else if (parsedUser.credits > 0) {
        db.prepare('UPDATE users SET credits = credits - 1, lastUsedDate = ? WHERE id = ?')
            .run(now, matchedKey.userId);
    }
};

const incrementUserWebUsage = (userId) => {
    try {
        db.prepare('UPDATE users SET dailyUsage = dailyUsage + 1, lastUsedDate = ? WHERE id = ?')
            .run(new Date().toISOString(), userId);
    } catch (error) {
        logger.error('Failed to increment web usage', { userId, error: error.message });
    }
};

// --- Guest rate limiting (SQLite-backed) ---

const checkGuestLimit = (ip) => {
    const today = new Date().toISOString().split('T')[0];
    const row = db.prepare('SELECT count, date FROM guest_limits WHERE ip = ?').get(ip);
    const count = (row && row.date === today) ? row.count : 0;
    return { usage: count, remaining: Math.max(0, GUEST_DAILY_LIMIT - count), limit: GUEST_DAILY_LIMIT };
};

const incrementGuestUsage = (ip) => {
    const today = new Date().toISOString().split('T')[0];
    db.prepare(`
        INSERT INTO guest_limits (ip, count, date) VALUES (?, 1, ?)
        ON CONFLICT(ip) DO UPDATE SET
            count = CASE WHEN date = excluded.date THEN count + 1 ELSE 1 END,
            date  = excluded.date
    `).run(ip, today);
};

module.exports = {
    computeKeyIndex,
    checkLimit,
    incrementUsage,
    incrementUserWebUsage,
    checkGuestLimit,
    incrementGuestUsage,
};
