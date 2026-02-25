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
    'api-pro': { name: 'API Pro', price: 35, webLimit: 20, apiCredits: 5000, maxFileSize: 25 * 1024 * 1024, credits: 0 },
    'api-ultra': { name: 'API Ultra', price: 90, webLimit: 20, apiCredits: 15000, maxFileSize: 50 * 1024 * 1024, credits: 0 },
    'credit-1.5k': { name: '1,500 Credits', price: 14, credits: 1500, type: 'credit' },
    'credit-3.5k': { name: '3,500 Credits', price: 28, credits: 3500, type: 'credit' },
    'credit-6.5k': { name: '6,500 Credits', price: 56, credits: 6500, type: 'credit' }
};
exports.PLANS = PLANS;

exports.register = async (req, res) => {
    try {
        const { email, plan, isSignup } = req.body;
        const cleanEmail = sanitizeString(email).toLowerCase();

        let existing = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail);

        if (existing) {
            // Send login link for existing users
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

            // Fire and forget email
            sendMagicLink(cleanEmail, link, name).catch(err => console.error("Async Magic Link Error:", err));

            return res.json({ success: true, message: 'Magic link sent to your email.' });
        }

        // If user doesn't exist, check if it's a valid signup attempt
        if (!isSignup) {
            // Reject login attempt for non-existent users
            return res.status(404).json({
                success: false,
                error: 'No account found with this email. Please sign up from the Developer page first.'
            });
        }

        // Create new user (Only if isSignup is true)
        const apiKey = 'sk_' + crypto.randomBytes(24).toString('hex');
        const apiKeyHash = await bcrypt.hash(apiKey, 10);
        const userId = crypto.randomUUID();
        const selectedPlan = PLANS[plan] ? plan : 'free';
        const planConfig = PLANS[selectedPlan];

        // Generate Magic Token for new user immediately
        const magicToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = new Date(Date.now() + 3600000).toISOString(); // 1 hour

        db.prepare(`INSERT INTO users (
            id, email, plan, webLimit, apiCredits, usage, dailyUsage, credits, createdAt, magicToken, tokenExpiry
        ) VALUES (?, ?, ?, ?, ?, 0, 0, ?, ?, ?, ?)`)
            .run(
                userId, cleanEmail, selectedPlan,
                planConfig.webLimit, planConfig.apiCredits,
                planConfig.credits || 0, new Date().toISOString(),
                magicToken, tokenExpiry
            );

        // Create Default API Key in new table
        const keyId = 'key_' + crypto.randomBytes(8).toString('hex');
        const prefix = apiKey.substring(0, 7) + '...';

        db.prepare(`
            INSERT INTO api_keys (id, userId, keyHash, name, prefix, createdAt, status)
            VALUES (?, ?, ?, 'Default API Key', ?, ?, 'active')
        `).run(keyId, userId, apiKeyHash, prefix, new Date().toISOString());

        // Send Welcome with Magic Link (Async - don't wait)
        // Include email in verification link
        const magicLink = `${process.env.FRONTEND_URL}/verify?token=${magicToken}&email=${encodeURIComponent(cleanEmail)}`;

        // Fire and forget email to speed up response
        sendWelcomeEmail(cleanEmail, magicLink).catch(err => console.error("Async Email Error:", err));

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

    const { company, address, billingEmail, vatNumber } = req.body;

    try {
        // Validate inputs (basic)
        const updates = {
            company: company ? sanitizeString(company) : null,
            address: address ? sanitizeString(address) : null,
            billingEmail: billingEmail && isValidEmail(billingEmail) ? billingEmail : null,
            vatNumber: vatNumber ? sanitizeString(vatNumber) : null
        };

        // Create invoiceDetails JSON
        const invoiceDetails = JSON.stringify(updates);

        // Update DB
        db.prepare(`
            UPDATE users 
            SET company = ?, address = ?, billingEmail = ?, vatNumber = ?, invoiceDetails = ?
            WHERE id = ?
        `).run(
            updates.company,
            updates.address,
            updates.billingEmail,
            updates.vatNumber,
            invoiceDetails,
            req.user.id
        );

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
exports.checkLimit = async (providedKey) => {
    // Get all Active keys for verification (Performance Note: in prod this should be optimized)
    const keys = db.prepare('SELECT * FROM api_keys WHERE status = \'active\'').all();

    let matchedKey = null;

    for (const key of keys) {
        const isMatch = await bcrypt.compare(providedKey, key.keyHash);
        if (isMatch) {
            matchedKey = key;
            break;
        }
    }

    if (!matchedKey) return { allowed: false, user: null };

    // Get user associated with key
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(matchedKey.userId);
    if (!user) return { allowed: false, user: null };

    const parsedUser = parseUser(user);
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
    // We reuse logic similar to checkLimit but optimized if possible
    // For now, iterate keys again to find match
    const keys = db.prepare('SELECT * FROM api_keys WHERE status = \'active\'').all();

    let matchedKey = null;
    for (const key of keys) {
        if (await bcrypt.compare(providedKey, key.keyHash)) {
            matchedKey = key;
            break;
        }
    }

    if (matchedKey) {
        // Update user stats
        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(matchedKey.userId);
        if (!user) return;

        const parsedUser = parseUser(user);

        // Update Key Last Used
        db.prepare('UPDATE api_keys SET lastUsedAt = ? WHERE id = ?').run(new Date().toISOString(), matchedKey.id);

        if (parsedUser.usage < parsedUser.apiCredits) {
            db.prepare('UPDATE users SET usage = usage + 1, lastUsedDate = ? WHERE id = ?')
                .run(new Date().toISOString(), matchedKey.userId);
        } else if (parsedUser.credits > 0) {
            db.prepare('UPDATE users SET credits = credits - 1, lastUsedDate = ? WHERE id = ?')
                .run(new Date().toISOString(), matchedKey.userId);
        }

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
