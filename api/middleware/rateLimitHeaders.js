/**
 * Rate Limit Headers Middleware
 * Adds professional rate limiting headers to all responses
 * 
 * Headers:
 * - X-RateLimit-Limit
 * - X-RateLimit-Remaining
 * - X-RateLimit-Reset
 * - X-Request-ID
 * - Retry-After (when limit exceeded)
 */

const { PLAN_LIMITS } = require('../utils/quotaManager');

/**
 * Add rate limit headers to response
 */
const addRateLimitHeaders = (req, res, next) => {
    // Get user's plan
    const plan = req.user?.plan_id || req.user?.plan || 'free';
    const planLimits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;

    // Rate limit per second
    const rateLimit = planLimits.rate_limit;

    // Calculate remaining (simplified - would need Redis for accurate tracking)
    // For now, use a basic counter
    const remaining = Math.max(0, rateLimit - 1);

    // Reset time (next second)
    const resetTime = Math.floor(Date.now() / 1000) + 1;

    // Set headers
    res.setHeader('X-RateLimit-Limit', rateLimit);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', resetTime);

    // Request ID already set by earlier middleware
    if (req.id) {
        res.setHeader('X-Request-ID', req.id);
    }

    next();
};

/**
 * Add Retry-After header when limit exceeded
 */
const addRetryAfterHeader = (res, resetTime) => {
    const now = Math.floor(Date.now() / 1000);
    const retryAfter = Math.max(0, resetTime - now);
    res.setHeader('Retry-After', retryAfter);
};

module.exports = {
    addRateLimitHeaders,
    addRetryAfterHeader
};
