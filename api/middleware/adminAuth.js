/**
 * Admin Authentication Middleware
 * Validates admin API key from request headers
 */

const adminAuth = (req, res, next) => {
    const adminKey = req.headers['x-admin-key'];
    const validAdminKey = process.env.ADMIN_API_KEY;

    if (!validAdminKey) {
        return res.status(500).json({
            error: 'Admin authentication not configured. Please set ADMIN_API_KEY in environment variables.'
        });
    }

    if (!adminKey || adminKey !== validAdminKey) {
        return res.status(401).json({
            error: 'Unauthorized. Invalid admin API key.'
        });
    }

    next();
};

module.exports = adminAuth;
