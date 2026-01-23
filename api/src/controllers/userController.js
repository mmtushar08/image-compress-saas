const fs = require('fs');
const path = require('path');
const { sendWelcomeEmail, sendLimitReachedEmail, sendMagicLink } = require('../services/emailService');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { sanitizeString, isValidEmail } = require('../utils/validation');
const db = require('../services/db');

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

// --- GUEST USAGE TRACKING (In-Memory) ---
const guestUsage = new Map();

exports.checkGuestLimit = (ip) => {
    const today = new Date().toISOString().split('T')[0];
    let record = guestUsage.get(ip);

    if (!record || record.date !== today) {
        record = { count: 0, date: today };
        guestUsage.set(ip, record);
    }
    return {
        usage: record.count,
        remaining: Math.max(0, 25 - record.count),
        limit: 25
    };
};

exports.incrementGuestUsage = (ip) => {
    const today = new Date().toISOString().split('T')[0];
    let record = guestUsage.get(ip);
    if (!record || record.date !== today) {
        record = { count: 0, date: today };
    }
    record.count += 1;
    guestUsage.set(ip, record);
};

// Plan Definitions
const PLANS = {
    free: { name: 'Free', price: 0, webLimit: 20, apiCredits: 500, maxFileSize: 5 * 1024 * 1024, credits: 0 },
    'web-pro': { name: 'Web Pro', price: 39, webLimit: -1, apiCredits: 500, maxFileSize: 75 * 1024 * 1024, credits: 0 },
    'web-ultra': { name: 'Web Ultra', price: 59, webLimit: -1, apiCredits: 500, maxFileSize: 150 * 1024 * 1024, credits: 0 },
    pro: { credits: 1000, name: 'Pro API', price: 9, maxFileSize: 25 * 1024 * 1024 }, // Legacy
    'api-pro': { name: 'API Pro', price: 35, webLimit: 20, apiCredits: 5000, maxFileSize: 25 * 1024 * 1024, credits: 5000 },
    'api-ultra': { name: 'API Ultra', price: 90, webLimit: 20, apiCredits: 15000, maxFileSize: 50 * 1024 * 1024, credits: 15000 },
    'credit-1.5k': { name: '1,500 Credits', price: 14, credits: 1500, type: 'credit' },
    'credit-3.5k': { name: '3,500 Credits', price: 28, credits: 3500, type: 'credit' },
    'credit-6.5k': { name: '6,500 Credits', price: 56, credits: 6500, type: 'credit' }
};
exports.PLANS = PLANS;

exports.register = async (req, res) => {
    try {
        const { email, plan } = req.body;
        const cleanEmail = sanitizeString(email).toLowerCase();

        let existing = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail);

        if (existing) {
            // Send login link instead
            const magicToken = crypto.randomBytes(32).toString('hex');
            const tokenExpiry = new Date(Date.now() + 3600000).toISOString(); // 1 hour

            db.prepare('UPDATE users SET magicToken = ?, tokenExpiry = ? WHERE email = ?')
                .run(magicToken, tokenExpiry, cleanEmail);

            // Include email in URL for POST verification
            const link = `${process.env.FRONTEND_URL}/verify?token=${magicToken}&email=${encodeURIComponent(cleanEmail)}`;

            // Extract name if available
            let name = 'there';
            try {
                if (existing.invoiceDetails) {
                    const details = JSON.parse(existing.invoiceDetails);
                    if (details.name) name = details.name;
                }
            } catch (e) { /* ignore parse error */ }

            await sendMagicLink(cleanEmail, link, name);

            return res.json({ success: true, message: 'User exists. Magic link sent.' });
        }

        // Create new user
        const apiKey = 'sk_' + crypto.randomBytes(24).toString('hex');
        const apiKeyHash = await bcrypt.hash(apiKey, 10);
        const userId = crypto.randomUUID();
        const selectedPlan = PLANS[plan] ? plan : 'free';
        const planConfig = PLANS[selectedPlan];

        db.prepare(`INSERT INTO users (
            id, email, apiKey, apiKeyHash, plan, webLimit, apiCredits, usage, dailyUsage, credits, createdAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, ?, ?)`)
            .run(
                userId, cleanEmail, apiKey, apiKeyHash, selectedPlan,
                planConfig.webLimit, planConfig.apiCredits,
                planConfig.credits || 0, new Date().toISOString()
            );

        // Send Welcome
        await sendWelcomeEmail(cleanEmail, `${process.env.FRONTEND_URL}/dashboard`);

        res.json({
            success: true,
            apiKey,
            message: 'Account created. Save your API key - you won\'t see it again!'
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
    res.json({ success: true, user: parseUser(freshUser) });
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
    const sessionExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Store session in database
    db.prepare('UPDATE users SET sessionToken = ?, sessionExpiry = ? WHERE id = ?')
        .run(sessionToken, sessionExpiry.toISOString(), user.id);

    // Set httpOnly cookie (secure in production)
    res.cookie('shrinkix_session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
        success: true,
        user: parseUser(user)
        // No API key or session token sent in response (httpOnly cookie only)
    });
};

// --- Check Limit (Used by Auth Middleware) ---
exports.checkLimit = async (providedKey) => {
    // Get all users to check hash
    const users = db.prepare('SELECT * FROM users').all();

    let matchedUser = null;

    // Find user by comparing hashes
    for (const user of users) {
        if (user.apiKeyHash) {
            const isMatch = await bcrypt.compare(providedKey, user.apiKeyHash);
            if (isMatch) {
                matchedUser = user;
                break;
            }
        } else if (user.apiKey === providedKey) {
            // Fallback for users not yet migrated
            matchedUser = user;
            break;
        }
    }

    if (!matchedUser) return { allowed: false, user: null };

    const parsedUser = parseUser(matchedUser);
    const planConfig = PLANS[parsedUser.plan] || PLANS.free;

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

exports.incrementUsage = async (providedKey) => {
    const users = db.prepare('SELECT * FROM users').all();

    for (const user of users) {
        let isMatch = false;

        if (user.apiKeyHash) {
            isMatch = await bcrypt.compare(providedKey, user.apiKeyHash);
        } else if (user.apiKey === providedKey) {
            isMatch = true;
        }

        if (isMatch) {
            const parsedUser = parseUser(user);

            if (parsedUser.usage < parsedUser.apiCredits) {
                db.prepare('UPDATE users SET usage = usage + 1, lastUsedDate = ? WHERE id = ?')
                    .run(new Date().toISOString(), user.id);
            } else if (parsedUser.credits > 0) {
                db.prepare('UPDATE users SET credits = credits - 1, lastUsedDate = ? WHERE id = ?')
                    .run(new Date().toISOString(), user.id);
            }
            break;
        }
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

    console.log(`Upgrading user ${email} to ${targetPlan}`);

    const planUpdatedAt = new Date().toISOString();
    // Reset usage on upgrade? logic can vary.

    db.prepare(`UPDATE users SET plan = ?, lastPaymentId = ?, planUpdatedAt = ? WHERE email = ?`)
        .run(targetPlan, paymentId, planUpdatedAt, email);

    user.plan = targetPlan;
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
