const crypto = require('crypto');
const bcrypt = require('bcrypt');
const db = require('./db');
const logger = require('../utils/logger');
const { sanitizeString } = require('../utils/validation');
const { PLANS } = require('./planService');
const { computeKeyIndex } = require('./usageService');
const {
    sendWelcomeEmail,
    sendMagicLink,
    sendAdminNewUserNotification,
} = require('./emailService');

const parseUser = (user) => {
    if (!user) return null;
    return {
        ...user,
        invoiceDetails: user.invoiceDetails ? JSON.parse(user.invoiceDetails) : {},
        webLimit:   Number(user.webLimit),
        apiCredits: Number(user.apiCredits),
        usage:      Number(user.usage),
        dailyUsage: Number(user.dailyUsage),
        credits:    Number(user.credits),
    };
};

const register = async (req, res) => {
    try {
        const { email, name, plan } = req.body;
        const cleanEmail = sanitizeString(email).toLowerCase();
        const cleanName = name ? sanitizeString(name).trim() : '';

        const existing = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail);

        if (existing) {
            const magicToken = crypto.randomBytes(32).toString('hex');
            const tokenExpiry = new Date(Date.now() + 3_600_000).toISOString();

            db.prepare('UPDATE users SET magicToken = ?, tokenExpiry = ? WHERE email = ?')
                .run(magicToken, tokenExpiry, cleanEmail);

            const link = `${process.env.FRONTEND_URL}/verify?token=${magicToken}&email=${encodeURIComponent(cleanEmail)}`;
            sendMagicLink(cleanEmail, link, existing.name || 'there')
                .catch(err => logger.error('Magic link send failed', { email: cleanEmail, error: err.message }));

            logger.info('Magic link sent to existing user', { email: cleanEmail });
            return res.json({ success: true, message: 'Magic link sent to your email.' });
        }

        // New user
        const apiKey     = 'sk_' + crypto.randomBytes(24).toString('hex');
        const apiKeyHash = await bcrypt.hash(apiKey, 10);
        const userId     = crypto.randomUUID();
        const selectedPlan = PLANS[plan] ? plan : 'free';
        const planConfig   = PLANS[selectedPlan];
        const magicToken   = crypto.randomBytes(32).toString('hex');
        const tokenExpiry  = new Date(Date.now() + 3_600_000).toISOString();
        const now          = new Date().toISOString();

        db.prepare(`
            INSERT INTO users (id, email, name, plan, webLimit, apiCredits, usage, dailyUsage, credits, createdAt, magicToken, tokenExpiry)
            VALUES (?, ?, ?, ?, ?, ?, 0, 0, ?, ?, ?, ?)
        `).run(userId, cleanEmail, cleanName || null, selectedPlan,
               planConfig.webLimit, planConfig.apiCredits,
               planConfig.credits || 0, now, magicToken, tokenExpiry);

        const keyId  = 'key_' + crypto.randomBytes(8).toString('hex');
        const prefix = apiKey.substring(0, 7) + '...';

        db.prepare(`
            INSERT INTO api_keys (id, userId, keyHash, keyIndex, name, prefix, createdAt, status)
            VALUES (?, ?, ?, ?, 'Default API Key', ?, ?, 'active')
        `).run(keyId, userId, apiKeyHash, computeKeyIndex(apiKey), prefix, now);

        const magicLink = `${process.env.FRONTEND_URL}/verify?token=${magicToken}&email=${encodeURIComponent(cleanEmail)}`;

        sendWelcomeEmail(cleanEmail, magicLink, cleanName || 'there')
            .catch(err => logger.error('Welcome email failed', { email: cleanEmail, error: err.message }));
        sendAdminNewUserNotification(cleanEmail, cleanName, selectedPlan)
            .catch(err => logger.error('Admin notification failed', { error: err.message }));

        logger.info('New user registered', { email: cleanEmail, plan: selectedPlan });
        res.json({ success: true, message: 'Account created! Check your email for the access link.' });
    } catch (error) {
        logger.error('Registration error', { error: error.message, stack: error.stack });
        res.status(500).json({ success: false, error: 'Registration failed' });
    }
};

const verifyToken = (req, res) => {
    const { token, email } = req.body;

    if (!token || !email) {
        return res.status(400).json({ success: false, error: 'Token and email required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE magicToken = ? AND email = ?').get(token, email);

    if (!user || new Date(user.tokenExpiry) < new Date()) {
        logger.warn('Invalid or expired magic token attempt', { email });
        return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }

    db.prepare('UPDATE users SET magicToken = null, tokenExpiry = null WHERE id = ?').run(user.id);

    const sessionToken  = crypto.randomBytes(32).toString('hex');
    const sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    db.prepare('UPDATE users SET sessionToken = ?, sessionExpiry = ? WHERE id = ?')
        .run(sessionToken, sessionExpiry, user.id);

    res.cookie('shrinkix_session', sessionToken, {
        httpOnly: true,
        secure:   process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge:   24 * 60 * 60 * 1000,
    });

    logger.info('User verified and logged in', { email });
    res.json({ success: true, user: parseUser(user) });
};

const logout = (req, res) => {
    const sessionToken = req.cookies?.shrinkix_session;
    if (sessionToken) {
        db.prepare('UPDATE users SET sessionToken = null, sessionExpiry = null WHERE sessionToken = ?')
            .run(sessionToken);
    }
    res.clearCookie('shrinkix_session');
    res.json({ success: true, message: 'Logged out successfully' });
};

module.exports = { register, verifyToken, logout };
