/**
 * userController — thin HTTP layer.
 * Business logic lives in:
 *   services/authService.js   — register, verifyToken, logout
 *   services/planService.js   — PLANS, upgradeUserPlan
 *   services/usageService.js  — checkLimit, incrementUsage, guest limits
 * Data access lives in repositories/.
 *
 * All exports are preserved so existing require('./userController') calls
 * in routes, middleware, and other controllers continue to work unchanged.
 */
const logger  = require('../utils/logger');
const { sanitizeString, isValidEmail } = require('../utils/validation');
const userRepo   = require('../repositories/userRepository');
const apiKeyRepo = require('../repositories/apiKeyRepository');

// --- Re-export from services ---
const { register, verifyToken, logout } = require('../services/authService');
const { PLANS, upgradeUserPlan }         = require('../services/planService');
const {
    checkLimit,
    incrementUsage,
    incrementUserWebUsage,
    checkGuestLimit,
    incrementGuestUsage,
} = require('../services/usageService');

exports.register             = register;
exports.verifyToken          = verifyToken;
exports.logout               = logout;
exports.PLANS                = PLANS;
exports.upgradeUserPlan      = upgradeUserPlan;
exports.checkLimit           = checkLimit;
exports.incrementUsage       = incrementUsage;
exports.incrementUserWebUsage = incrementUserWebUsage;
exports.checkGuestLimit      = checkGuestLimit;
exports.incrementGuestUsage  = incrementGuestUsage;

// --- Thin controller handlers (HTTP only, no business logic) ---

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

exports.getProfile = async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const freshUser = await userRepo.findById(req.user.id);
        if (!freshUser) return res.status(404).json({ error: 'User not found' });

        try {
            const keyRecord = await apiKeyRepo.findActivePrefixByUserId(req.user.id);
            if (keyRecord?.prefix) freshUser.apiKey = keyRecord.prefix;
        } catch (e) {
            logger.warn('Could not fetch API key prefix for profile', { userId: req.user.id, error: e.message });
        }

        res.json({ success: true, user: parseUser(freshUser) });
    } catch (error) {
        logger.error('Get profile failed', { userId: req.user.id, error: error.message });
        res.status(500).json({ success: false, error: 'Failed to load profile' });
    }
};

exports.updateProfile = async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { name, company, address, billingEmail, vatNumber } = req.body;

    try {
        const cleanName      = name ? sanitizeString(name).trim() : null;
        const invoiceDetails = JSON.stringify({
            company:      company      ? sanitizeString(company)      : null,
            address:      address      ? sanitizeString(address)      : null,
            billingEmail: billingEmail && isValidEmail(billingEmail) ? billingEmail : null,
            vatNumber:    vatNumber    ? sanitizeString(vatNumber)    : null,
        });

        await userRepo.updateById(req.user.id, { name: cleanName, invoiceDetails });

        logger.info('User profile updated', { userId: req.user.id });
        res.json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        logger.error('Profile update failed', { userId: req.user.id, error: error.message });
        res.status(500).json({ success: false, error: 'Failed to update profile' });
    }
};
