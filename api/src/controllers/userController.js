const fs = require('fs');
const path = require('path');
const { sendWelcomeEmail, sendLimitReachedEmail, sendMagicLink, sendAdminNewUserNotification } = require('../services/emailService');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { sanitizeString, isValidEmail } = require('../utils/validation');
const db = require('../services/db');
const logger = require('../utils/logger');

// Compute a fast, deterministic index for an API key (SHA-256, hex).
// High-entropy keys (192-bit random) make this safe for auth lookup.
const keyIndex = (rawKey) => crypto.createHash('sha256').update(rawKey).digest('hex');

// --- Helper: Parse User from DB ---
const parseUser = (user) => {
    if (!user) return null;
    return {
        ...user,
        invoiceDetails: user.invoiceDetails ? JSON.parse(user.invoiceDetails) : {},
        // Ensure numbers
        webLimit: Number(user.webLimit),
        apiCredits: Number(user.apiCredits),
        usage: Number(user.usage),
        dailyUsage: Number(user.dailyUsage),
        credits: Number(user.credits)
    };
};

// --- GUEST USAGE TRACKING (SQLite-backed — survives restarts, shared across PM2 workers) ---
const GUEST_DAILY_LIMIT = 25;

exports.checkGuestLimit = (ip) => {
    const today = new Date().toISOString().split('T')[0];
    const row = db.prepare('SELECT count, date FROM guest_limits WHERE ip = ?').get(ip);
    const count = (row && row.date === today) ? row.count : 0;
    return { usage: count, remaining: Math.max(0, GUEST_DAILY_LIMIT - count), limit: GUEST_DAILY_LIMIT };
};

exports.incrementGuestUsage = (ip) => {
    const today = new Date().toISOString().split('T')[0];
    db.prepare(`
        INSERT INTO guest_limits (ip, count, date) VALUES (?, 1, ?)
        ON CONFLICT(ip) DO UPDATE SET
            count = CASE WHEN date = excluded.date THEN count + 1 ELSE 1 END,
            date  = excluded.date
    `).run(ip, today);
};

// Plan Definitions
const PLANS = {
    free: { name: 'Free', price: 0, webLimit: 20, apiCredits: 500, maxFileSize: 5 * 1024 * 1024, credits: 0 },
    'web-pro': { name: 'Web Pro', price: 39, webLimit: -1, apiCredits: 500, maxFileSize: 75 * 1024 * 1024, credits: 0 },
    'web-ultra': { name: 'Web Ultra', price: 59, webLimit: -1, apiCredits: 500, maxFileSize: 150 * 1024 * 1024, credits: 0 },
    'api-pro': { name: 'API Pro', price: 35, webLimit: 20, apiCredits: 5000, maxFileSize: 25 * 1024 * 1024, credits: 0 },
    'api-ultra': { name: 'API Ultra', price: 90, webLimit: 20, apiCredits: 15000, maxFileSize: 50 * 1024 * 1024, credits: 0 },
    'credit-1.5k': { name: '1,500 Credits', price: 14, credits: 1500, type: 'credit' },
    'credit-3.5k': { name: '3,500 Credits', price: 28, credits: 3500, type: 'credit' },
    'credit-6.5k': { name: '6,500 Credits', price: 56, credits: 6500, type: 'credit' }
};
exports.PLANS = PLANS;

exports.register = async (req, res) => {
    try {
        const { email, name, plan } = req.body;
        const cleanEmail = sanitizeString(email).toLowerCase();
        const cleanName = name ? sanitizeString(name).trim() : '';

        let existing = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail);

        if (existing) {
            // Existing user — send magic login link
            const magicToken = crypto.randomBytes(32).toString('hex');
            const tokenExpiry = new Date(Date.now() + 3600000).toISOString();

            db.prepare('UPDATE users SET magicToken = ?, tokenExpiry = ? WHERE email = ?')
                .run(magicToken, tokenExpiry, cleanEmail);

            const link = `${process.env.FRONTEND_URL}/verify?token=${magicToken}&email=${encodeURIComponent(cleanEmail)}`;
            const displayName = existing.name || 'there';

            sendMagicLink(cleanEmail, link, displayName).catch(err => console.error("Async Magic Link Error:", err));

            return res.json({ success: true, message: 'Magic link sent to your email.' });
        }

        // New user — create account
        const apiKey = 'sk_' + crypto.randomBytes(24).toString('hex');
        const apiKeyHash = await bcrypt.hash(apiKey, 10);
        const userId = crypto.randomUUID();
        const selectedPlan = PLANS[plan] ? plan : 'free';
        const planConfig = PLANS[selectedPlan];

        const magicToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = new Date(Date.now() + 3600000).toISOString();
        const now = new Date().toISOString();

        db.prepare(`INSERT INTO users (
            id, email, name, plan, webLimit, apiCredits, usage, dailyUsage, credits, createdAt, magicToken, tokenExpiry
        ) VALUES (?, ?, ?, ?, ?, ?, 0, 0, ?, ?, ?, ?)`)
            .run(
                userId, cleanEmail, cleanName || null, selectedPlan,
                planConfig.webLimit, planConfig.apiCredits,
                planConfig.credits || 0, now,
                magicToken, tokenExpiry
            );

        const keyId = 'key_' + crypto.randomBytes(8).toString('hex');
        const prefix = apiKey.substring(0, 7) + '...';

        db.prepare(`
            INSERT INTO api_keys (id, userId, keyHash, keyIndex, name, prefix, createdAt, status)
            VALUES (?, ?, ?, ?, 'Default API Key', ?, ?, 'active')
        `).run(keyId, userId, apiKeyHash, keyIndex(apiKey), prefix, now);

        const magicLink = `${process.env.FRONTEND_URL}/verify?token=${magicToken}&email=${encodeURIComponent(cleanEmail)}`;

        // Notify user and admin (fire and forget)
        sendWelcomeEmail(cleanEmail, magicLink, cleanName || 'there').catch(err => console.error("Async Email Error:", err));
        sendAdminNewUserNotification(cleanEmail, cleanName, selectedPlan).catch(err => console.error("Async Admin Notify Error:", err));

        res.json({
            success: true,
            message: 'Account created! Check your email for the access link.'
        });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ success: false, error: 'Registration failed' });
    }
};

exports.getProfile = (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    // Refresh from DB
    const freshUser = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);

    // Fetch active API key prefix (Defensive)
    try {
        const apiKeyRecord = db.prepare("SELECT prefix FROM api_keys WHERE userId = ? AND status = 'active' LIMIT 1").get(req.user.id);

        // Attach masked key for display
        if (apiKeyRecord && apiKeyRecord.prefix) {
            freshUser.apiKey = apiKeyRecord.prefix;
        }
    } catch (e) {
        console.error("Failed to fetch API key for profile:", e);
        // Continue without key - do not crash profile load
    }

    res.json({ success: true, user: parseUser(freshUser) });
};

exports.updateProfile = (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { name, company, address, billingEmail, vatNumber } = req.body;

    try {
        const cleanName = name ? sanitizeString(name).trim() : null;
        const invoiceDetails = JSON.stringify({
            company: company ? sanitizeString(company) : null,
            address: address ? sanitizeString(address) : null,
            billingEmail: billingEmail && isValidEmail(billingEmail) ? billingEmail : null,
            vatNumber: vatNumber ? sanitizeString(vatNumber) : null,
        });

        db.prepare(`UPDATE users SET name = ?, invoiceDetails = ? WHERE id = ?`)
            .run(cleanName, invoiceDetails, req.user.id);

        res.json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ success: false, error: 'Failed to update profile' });
    }
};

exports.verifyToken = (req, res) => {
    // Changed from req.query to req.body for POST request
    const { token, email } = req.body;

    if (!token || !email) {
        return res.status(400).json({
            success: false,
            error: 'Token and email required'
        });
    }

    const user = db.prepare('SELECT * FROM users WHERE magicToken = ? AND email = ?')
        .get(token, email);

    if (!user || new Date(user.tokenExpiry) < new Date()) {
        return res.status(401).json({
            success: false,
            error: 'Invalid or expired token'
        });
    }

    // Clear token (single-use)
    db.prepare('UPDATE users SET magicToken = null, tokenExpiry = null WHERE id = ?')
        .run(user.id);

    // Generate session token for cookie-based auth
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store session in database
    db.prepare('UPDATE users SET sessionToken = ?, sessionExpiry = ? WHERE id = ?')
        .run(sessionToken, sessionExpiry.toISOString(), user.id);

    // Set httpOnly cookie (secure in production)
    res.cookie('shrinkix_session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.json({
        success: true,
        user: parseUser(user)
        // No API key or session token sent in response (httpOnly cookie only)
    });
};

// --- Check Limit (Used by Auth Middleware) ---
// --- Check Limit (Used by Auth Middleware) ---
// O(1) API key lookup: SHA-256 index → single row → no bcrypt loop
const findKeyByIndex = (providedKey) => {
    const idx = keyIndex(providedKey);
    // Fast path: key has a keyIndex (all keys created after this fix)
    const byIndex = db.prepare("SELECT * FROM api_keys WHERE keyIndex = ? AND status = 'active'").get(idx);
    if (byIndex) return byIndex;

    // Slow fallback: legacy keys without keyIndex — bcrypt loop, will shrink over time as keys are regenerated
    const legacyKeys = db.prepare("SELECT * FROM api_keys WHERE keyIndex IS NULL AND status = 'active'").all();
    for (const k of legacyKeys) {
        try {
            if (bcrypt.compareSync(providedKey, k.keyHash)) return k;
        } catch (_) {}
    }
    return null;
};

exports.checkLimit = (providedKey) => {
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

exports.incrementUsage = (providedKey) => {
    const matchedKey = findKeyByIndex(providedKey);
    if (!matchedKey) return;

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(matchedKey.userId);
    if (!user) return;

    const parsedUser = parseUser(user);
    const now = new Date().toISOString();

    db.prepare('UPDATE api_keys SET lastUsedAt = ? WHERE id = ?').run(now, matchedKey.id);

    if (parsedUser.usage < parsedUser.apiCredits) {
        db.prepare('UPDATE users SET usage = usage + 1, lastUsedDate = ? WHERE id = ?').run(now, matchedKey.userId);
    } else if (parsedUser.credits > 0) {
        db.prepare('UPDATE users SET credits = credits - 1, lastUsedDate = ? WHERE id = ?').run(now, matchedKey.userId);
    }
};

exports.incrementUserWebUsage = (userId) => {
    try {
        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
        if (!user) return;

        const parsedUser = parseUser(user);

        // Ensure webLimit rules (though normally checked before compression)
        // Increment dailyUsage for web tracking (resets via cron job)
        db.prepare('UPDATE users SET dailyUsage = dailyUsage + 1, lastUsedDate = ? WHERE id = ?')
            .run(new Date().toISOString(), userId);

    } catch (error) {
        console.error("Failed to increment web usage:", error);
    }
};

exports.upgradeUserPlan = (email, planName, paymentId) => {
    const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!row) return null;
    let user = parseUser(row);

    // Normalize plan names
    let targetPlan = planName;
    if (planName === 'pro') targetPlan = 'web-pro';
    else if (planName === 'ultra') targetPlan = 'web-ultra';

    // Handle Credit Bundles
    if (targetPlan.startsWith('credit-')) {
        const bundle = PLANS[targetPlan];
        if (!bundle) {
            console.error(`Invalid credit bundle: ${targetPlan}`);
            return null;
        }

        const newCredits = (user.credits || 0) + bundle.credits;
        console.log(`Adding ${bundle.credits} credits to user ${email}. New Balance: ${newCredits}`);

        db.prepare(`UPDATE users SET credits = ?, lastPaymentId = ? WHERE email = ?`)
            .run(newCredits, paymentId, email);

        user.credits = newCredits;
        return user;
    }

    if (!PLANS[targetPlan]) {
        console.error(`Invalid plan requested: ${planName}`);
        return null;
    }

    const planConfig = PLANS[targetPlan];

    console.log(`Upgrading user ${email} to ${targetPlan}`);

    const planUpdatedAt = new Date().toISOString();
    // Reset usage on upgrade? logic can vary. Let's reset usage to 0 for the new plan cycle.
    // Also update webLimit and apiCredits from the plan config.

    db.prepare(`
        UPDATE users 
        SET plan = ?, 
            lastPaymentId = ?, 
            planUpdatedAt = ?,
            webLimit = ?,
            apiCredits = ?,
            usage = 0 -- Reset usage on upgrade
        WHERE email = ?
    `).run(
        targetPlan,
        paymentId,
        planUpdatedAt,
        planConfig.webLimit || 20,
        planConfig.apiCredits || 0,
        email
    );

    user.plan = targetPlan;
    user.webLimit = planConfig.webLimit || 20;
    user.apiCredits = planConfig.apiCredits || 0;
    user.usage = 0;

    return user;
};

// Logout - Clear session
exports.logout = (req, res) => {
    const sessionToken = req.cookies?.shrinkix_session;

    if (sessionToken) {
        // Clear session from database
        db.prepare('UPDATE users SET sessionToken = null, sessionExpiry = null WHERE sessionToken = ?')
            .run(sessionToken);
    }

    // Clear cookie
    res.clearCookie('shrinkix_session');

    res.json({ success: true, message: 'Logged out successfully' });
};
