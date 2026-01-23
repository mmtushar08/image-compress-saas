const { checkLimit, incrementUsage } = require('../controllers/userController');
const db = require('../services/db');

/**
 * Auth Middleware
 * Validates session cookies and API keys, tracks usage.
 */
module.exports = async (req, res, next) => {
    // Allow health check and registration without auth
    if (req.path === '/api/health' || req.path === '/api/users/register') {
        return next();
    }

    // Check for session cookie first (for web users)
    const sessionToken = req.cookies?.shrinkix_session;

    if (sessionToken) {
        const user = db.prepare('SELECT * FROM users WHERE sessionToken = ?').get(sessionToken);

        if (user && new Date(user.sessionExpiry) > new Date()) {
            // Valid session - attach user and continue
            req.user = {
                id: user.id,
                email: user.email,
                plan: user.plan,
                webLimit: user.webLimit,
                apiCredits: user.apiCredits,
                usage: user.usage,
                dailyUsage: user.dailyUsage,
                credits: user.credits
            };
            return next();
        } else if (user) {
            // Session expired - clear cookie
            res.clearCookie('shrinkix_session');
        }
    }

    // Fall back to API key authentication (for API users)
    const authHeader = req.headers.authorization;
    const apiKeyHeader = req.headers['x-api-key'];

    console.log(`[AuthMiddleware] ${req.method} ${req.url} - AuthHeader: ${authHeader ? 'Yes' : 'No'}, ApiKeyHeader: ${apiKeyHeader ? 'Yes' : 'No'}`);

    let token = null;

    // Support Bearer Token
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }
    // Support Custom X-API-Key Header
    else if (apiKeyHeader) {
        token = apiKeyHeader;
    }
    // Support Trimixo Style Basic Auth (api:KEY)
    else if (authHeader && authHeader.startsWith('Basic ')) {
        try {
            const base64 = authHeader.split(' ')[1];
            const decoded = Buffer.from(base64, 'base64').toString('utf-8');
            // Trimixo uses 'api:KEY'. We handle that or just the key.
            const parts = decoded.split(':');
            token = parts.length > 1 ? parts[1] : parts[0];
        } catch (e) {
            token = null;
        }
    }

    // If no token is provided, we treat it as "Anonymous Free Tier" 
    // (Limiting for this is handled in server.js IP-based limiter)
    if (!token) {
        return next();
    }

    // Validate Token against DB (now async with bcrypt)
    console.log(`[AuthMiddleware] Checking limit for token: ${token.substring(0, 10)}...`);
    const result = await checkLimit(token);
    console.log(`[AuthMiddleware] Check result: allowed=${result.allowed}, user=${result.user ? 'Yes' : 'No'}`);

    // If the token is invalid (no user found), reject immediately
    if (!result.user) {
        return res.status(401).json({ success: false, error: "Invalid API Key" });
    }

    // Determine if the current path is a "critical" one that should be blocked if limit reached
    const isCriticalPath = req.originalUrl.includes('/api/compress');

    if (!result.allowed && isCriticalPath) {
        return res.status(403).json({ success: false, error: result.error });
    }

    req.user = result.user;
    req.apiKey = token;

    // Increment usage on successful compression (now async)
    res.on('finish', async () => {
        const isCompress = req.originalUrl && req.originalUrl.includes('/api/compress');
        const isSuccess = res.statusCode >= 200 && res.statusCode < 300;

        if (isCompress && isSuccess) {
            await incrementUsage(token);
        }
    });

    next();
};
