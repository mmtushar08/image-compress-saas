const crypto = require('crypto');
const bcrypt = require('bcrypt');
const logger = require('../utils/logger');
const { sanitizeString } = require('../utils/validation');
const { PLANS } = require('./planService');
const { computeKeyIndex } = require('./usageService');
const userRepo   = require('../repositories/userRepository');
const apiKeyRepo = require('../repositories/apiKeyRepository');
const { audit } = require('./auditService');
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

        const existing = await userRepo.findByEmail(cleanEmail);

        if (existing) {
            const magicToken = crypto.randomBytes(32).toString('hex');
            const tokenExpiry = new Date(Date.now() + 3_600_000).toISOString();

            await userRepo.updateByEmail(cleanEmail, { magicToken, tokenExpiry });

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

        await userRepo.create({
            id: userId,
            email: cleanEmail,
            name: cleanName || null,
            plan: selectedPlan,
            webLimit: planConfig.webLimit,
            apiCredits: planConfig.apiCredits,
            usage: 0,
            dailyUsage: 0,
            credits: planConfig.credits || 0,
            createdAt: now,
            magicToken,
            tokenExpiry,
        });

        const keyId  = 'key_' + crypto.randomBytes(8).toString('hex');
        const prefix = apiKey.substring(0, 7) + '...';

        await apiKeyRepo.create({
            id: keyId,
            userId,
            keyHash: apiKeyHash,
            keyIndex: computeKeyIndex(apiKey),
            name: 'Default API Key',
            prefix,
            createdAt: now,
            status: 'active',
        });

        const magicLink = `${process.env.FRONTEND_URL}/verify?token=${magicToken}&email=${encodeURIComponent(cleanEmail)}`;

        sendWelcomeEmail(cleanEmail, magicLink, cleanName || 'there')
            .catch(err => logger.error('Welcome email failed', { email: cleanEmail, error: err.message }));
        sendAdminNewUserNotification(cleanEmail, cleanName, selectedPlan)
            .catch(err => logger.error('Admin notification failed', { error: err.message }));

        logger.info('New user registered', { email: cleanEmail, plan: selectedPlan });
        audit('user.register', { actorType: 'user', actorId: userId, targetType: 'user', targetId: userId, ip: req.ip, metadata: { email: cleanEmail, plan: selectedPlan } });
        res.json({ success: true, message: 'Account created! Check your email for the access link.' });
    } catch (error) {
        logger.error('Registration error', { error: error.message, stack: error.stack });
        res.status(500).json({ success: false, error: 'Registration failed' });
    }
};

const verifyToken = async (req, res) => {
    try {
        const { token, email } = req.body;

        if (!token || !email) {
            return res.status(400).json({ success: false, error: 'Token and email required' });
        }

        const user = await userRepo.findByMagicToken(token, email);

        if (!user || new Date(user.tokenExpiry) < new Date()) {
            logger.warn('Invalid or expired magic token attempt', { email });
            return res.status(401).json({ success: false, error: 'Invalid or expired token' });
        }

        const sessionToken  = crypto.randomBytes(32).toString('hex');
        const sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

        await userRepo.updateById(user.id, {
            magicToken: null,
            tokenExpiry: null,
            sessionToken,
            sessionExpiry,
        });

        res.cookie('shrinkix_session', sessionToken, {
            httpOnly: true,
            secure:   process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge:   24 * 60 * 60 * 1000,
        });

        logger.info('User verified and logged in', { email });
        audit('auth.login', { actorType: 'user', actorId: user.id, targetType: 'user', targetId: user.id, ip: req.ip, metadata: { email } });
        res.json({ success: true, user: parseUser(user) });
    } catch (error) {
        logger.error('Token verification error', { error: error.message });
        res.status(500).json({ success: false, error: 'Verification failed' });
    }
};

const logout = async (req, res) => {
    try {
        const sessionToken = req.cookies?.shrinkix_session;
        if (sessionToken) {
            await userRepo.clearSession(sessionToken);
        }
        res.clearCookie('shrinkix_session');
        res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        logger.error('Logout error', { error: error.message });
        res.status(500).json({ success: false, error: 'Logout failed' });
    }
};

module.exports = { register, verifyToken, logout };
