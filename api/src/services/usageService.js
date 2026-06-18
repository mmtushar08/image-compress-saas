const crypto = require('crypto');
const bcrypt = require('bcrypt');
const logger = require('../utils/logger');
const apiKeyRepo = require('../repositories/apiKeyRepository');
const userRepo   = require('../repositories/userRepository');
const guestRepo  = require('../repositories/guestLimitRepository');

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
const findKeyByIndex = async (providedKey) => {
    const idx = computeKeyIndex(providedKey);
    const byIndex = await apiKeyRepo.findActiveByIndex(idx);
    if (byIndex) return byIndex;

    // Legacy keys (no keyIndex) — shrinks over time as users regenerate keys
    const legacyKeys = await apiKeyRepo.findActiveLegacyKeys();
    for (const k of legacyKeys) {
        try {
            if (bcrypt.compareSync(providedKey, k.keyHash)) return k;
        } catch (_) {}
    }
    return null;
};

const checkLimit = async (providedKey) => {
    const matchedKey = await findKeyByIndex(providedKey);
    if (!matchedKey) return { allowed: false, user: null };

    const user = await userRepo.findById(matchedKey.userId);
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

const incrementUsage = async (providedKey) => {
    const matchedKey = await findKeyByIndex(providedKey);
    if (!matchedKey) return;

    const user = await userRepo.findById(matchedKey.userId);
    if (!user) return;

    const parsedUser = parseUser(user);
    const now = new Date().toISOString();

    await apiKeyRepo.updateLastUsed(matchedKey.id, now);

    if (parsedUser.usage < parsedUser.apiCredits) {
        await userRepo.incrementUsage(matchedKey.userId, now);
    } else if (parsedUser.credits > 0) {
        await userRepo.decrementCredits(matchedKey.userId, now);
    }
};

const incrementUserWebUsage = async (userId) => {
    try {
        await userRepo.incrementDailyUsage(userId, new Date().toISOString());
    } catch (error) {
        logger.error('Failed to increment web usage', { userId, error: error.message });
    }
};

// --- Guest rate limiting (SQLite/Postgres-backed) ---

const checkGuestLimit = async (ip) => {
    const today = new Date().toISOString().split('T')[0];
    const row = await guestRepo.findByIp(ip);
    const count = (row && row.date === today) ? Number(row.count) : 0;
    return { usage: count, remaining: Math.max(0, GUEST_DAILY_LIMIT - count), limit: GUEST_DAILY_LIMIT };
};

const incrementGuestUsage = async (ip) => {
    const today = new Date().toISOString().split('T')[0];
    await guestRepo.increment(ip, today);
};

module.exports = {
    computeKeyIndex,
    checkLimit,
    incrementUsage,
    incrementUserWebUsage,
    checkGuestLimit,
    incrementGuestUsage,
};
