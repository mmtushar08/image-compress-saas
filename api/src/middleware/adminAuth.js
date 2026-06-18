/**
 * Admin Authentication Middleware
 * Validates the admin API key from request headers using a constant-time
 * comparison so the check does not leak key length/content via timing.
 */
const crypto = require('crypto');
const logger = require('../utils/logger');

const safeEqual = (a, b) => {
    const bufA = Buffer.from(String(a));
    const bufB = Buffer.from(String(b));
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
};

const adminAuth = (req, res, next) => {
    const adminKey = req.headers['x-admin-key'];
    const validAdminKey = process.env.ADMIN_API_KEY;

    if (!validAdminKey) {
        return res.status(500).json({
            error: 'Admin authentication not configured. Please set ADMIN_API_KEY in environment variables.'
        });
    }

    if (!adminKey || !safeEqual(adminKey, validAdminKey)) {
        logger.warn('Unauthorized admin access attempt', { ip: req.ip, path: req.originalUrl });
        return res.status(401).json({ error: 'Unauthorized. Invalid admin API key.' });
    }

    next();
};

module.exports = adminAuth;
