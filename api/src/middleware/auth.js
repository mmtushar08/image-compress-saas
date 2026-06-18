const { checkLimit, incrementUsage } = require('../controllers/userController');
const userRepo = require('../repositories/userRepository');
const logger = require('../utils/logger');

/**
 * Auth Middleware
 * Validates session cookies and API keys, tracks usage.
 */
module.exports = async (req, res, next) => {
    try {
        // Allow health check and registration without auth
        if (req.path === '/api/health' || req.path === '/api/users/register') {
            return next();
        }

        // Check for session cookie first (web users)
        const sessionToken = req.cookies?.shrinkix_session;

        if (sessionToken) {
            const user = await userRepo.findBySessionToken(sessionToken);

            if (user && new Date(user.sessionExpiry) > new Date()) {
                req.user = {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    plan: user.plan,
                    webLimit: user.webLimit,
                    apiCredits: user.apiCredits,
                    usage: user.usage,
                    dailyUsage: user.dailyUsage,
                    credits: user.credits
                };
                return next();
            } else if (user) {
                res.clearCookie('shrinkix_session');
            }
        }

        // Fall back to API key authentication
        const authHeader = req.headers.authorization;
        const apiKeyHeader = req.headers['x-api-key'];

        let token = null;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } else if (apiKeyHeader) {
            token = apiKeyHeader;
        } else if (authHeader && authHeader.startsWith('Basic ')) {
            try {
                const decoded = Buffer.from(authHeader.split(' ')[1], 'base64').toString('utf-8');
                const parts = decoded.split(':');
                token = parts.length > 1 ? parts[1] : parts[0];
            } catch (_) {
                token = null;
            }
        }

        if (!token) return next();

        // O(1) key lookup (SHA-256 index, bcrypt fallback for legacy keys)
        const result = await checkLimit(token);

        logger.debug('API key auth', {
            path: req.originalUrl,
            allowed: result.allowed,
            hasUser: !!result.user
        });

        if (!result.user) {
            return res.status(401).json({ success: false, error: 'Invalid API Key' });
        }

        const isCriticalPath = req.originalUrl.includes('/api/compress');
        if (!result.allowed && isCriticalPath) {
            return res.status(403).json({ success: false, error: result.error });
        }

        req.user = result.user;
        req.apiKey = token;

        // Increment usage after successful compression (fire-and-forget)
        res.on('finish', () => {
            const isCompress = req.originalUrl && req.originalUrl.includes('/api/compress');
            const isSuccess = res.statusCode >= 200 && res.statusCode < 300;
            if (isCompress && isSuccess) {
                incrementUsage(token).catch(err =>
                    logger.error('Usage increment failed', { error: err.message }));
            }
        });

        next();
    } catch (error) {
        logger.error('Auth middleware error', { error: error.message, stack: error.stack });
        res.status(500).json({ success: false, error: 'Authentication error' });
    }
};
