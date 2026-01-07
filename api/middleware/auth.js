const { checkLimit, incrementUsage } = require('../controllers/userController');

/**
 * Auth Middleware
 * Validates API keys and tracks usage.
 */
module.exports = (req, res, next) => {
    // Allow health check and registration without auth
    if (req.path === '/api/health' || req.path === '/api/users/register') {
        return next();
    }

    const authHeader = req.headers.authorization;
    const apiKeyHeader = req.headers['x-api-key'];

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

    // Validate Token against DB
    const result = checkLimit(token);

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

    // Increment usage on successful compression
    // We use req.baseUrl or req.originalUrl to be safer against nested routers
    res.on('finish', () => {
        const isCompress = req.originalUrl && req.originalUrl.includes('/api/compress');
        const isSuccess = res.statusCode >= 200 && res.statusCode < 300;

        if (isCompress && isSuccess) {
            incrementUsage(token);
        }
    });

    next();
};
