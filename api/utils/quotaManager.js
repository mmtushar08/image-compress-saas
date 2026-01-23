const db = require('../services/db');
const logger = require('./logger');

/**
 * Quota Manager (API Key Level)
 * Tracks quotas at API key level, not user level
 * Supports: multiple keys per user, web+API separation, team plans
 */

// Plan definitions - CORRECTED for production safety
const PLAN_LIMITS = {
    // Free tier
    free: {
        monthly_limit: 500,        // API quota
        webLimit: 20,              // Daily web compressions
        max_file_size: 5 * 1024 * 1024,  // 5MB - SAFE
        maxPixels: 16000000,       // 4000x4000
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        features: ['compress'],
        max_operations: 1,
        rate_limit: 0.5            // req/sec
    },

    // WEB PLANS - NO API QUOTA (humans only)
    'web-pro': {
        monthly_limit: 0,          // ❌ NO API ACCESS
        webLimit: -1,              // ✅ Unlimited web
        max_file_size: 10 * 1024 * 1024,  // 10MB - SAFE for KVM1
        maxPixels: 36000000,       // 6000x6000
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        features: ['compress', 'resize'],
        max_operations: 2,
        rate_limit: 2
    },
    'web-ultra': {
        monthly_limit: 0,          // ❌ NO API ACCESS
        webLimit: -1,              // ✅ Unlimited web
        max_file_size: 25 * 1024 * 1024,  // 25MB - SAFE for KVM1
        maxPixels: 64000000,       // 8000x8000
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
        features: ['compress', 'resize', 'crop', 'avif'],
        max_operations: 3,
        rate_limit: 5
    },

    // API PLANS - API QUOTA ONLY (automation only)
    starter: {
        monthly_limit: 2000,       // ✅ API quota
        webLimit: 0,               // ❌ NO WEB ACCESS
        max_file_size: 10 * 1024 * 1024,  // 10MB - SAFE
        maxPixels: 36000000,       // 6000x6000
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        features: ['compress', 'resize'],
        max_operations: 2,
        rate_limit: 1
    },
    pro: {
        monthly_limit: 10000,      // ✅ API quota
        webLimit: 0,               // ❌ NO WEB ACCESS
        max_file_size: 25 * 1024 * 1024,  // 25MB - SAFE
        maxPixels: 64000000,       // 8000x8000
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
        features: ['compress', 'resize', 'crop', 'avif'],
        max_operations: 3,
        rate_limit: 2
    },
    'api-pro': {
        monthly_limit: 5000,       // ✅ API quota
        webLimit: 0,               // ❌ NO WEB ACCESS
        max_file_size: 10 * 1024 * 1024,  // 10MB - SAFE
        maxPixels: 36000000,       // 6000x6000
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        features: ['compress', 'resize'],
        max_operations: 2,
        rate_limit: 2
    },
    'api-ultra': {
        monthly_limit: 20000,      // ✅ API quota
        webLimit: 0,               // ❌ NO WEB ACCESS
        max_file_size: 25 * 1024 * 1024,  // 25MB - SAFE
        maxPixels: 64000000,       // 8000x8000
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
        features: ['compress', 'resize', 'crop', 'avif', 'metadata'],
        max_operations: 3,
        rate_limit: 5
    },

    // BUSINESS - BOTH WEB + API (premium)
    business: {
        monthly_limit: 50000,      // ✅ API quota
        webLimit: -1,              // ✅ Unlimited web
        max_file_size: 50 * 1024 * 1024,  // 50MB - Only for business
        maxPixels: 64000000,       // 8000x8000
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
        features: ['compress', 'resize', 'crop', 'avif', 'metadata'],
        max_operations: 4,
        rate_limit: 10             // Higher for business
    }
};

/**
 * Get API key details from database
 */
const getApiKey = (key) => {
    return db.prepare('SELECT * FROM api_keys WHERE key = ? AND is_active = 1').get(key);
};

/**
 * Check if billing cycle needs reset
 */
const checkAndResetCycle = (apiKey) => {
    const now = new Date();
    const resetDate = new Date(apiKey.reset_at);

    if (now >= resetDate) {
        // Calculate next reset date
        const nextReset = new Date(now);
        nextReset.setMonth(nextReset.getMonth() + 1);
        nextReset.setDate(1);
        nextReset.setHours(0, 0, 0, 0);

        // Reset usage counter
        db.prepare(`
            UPDATE api_keys 
            SET used_count = 0, 
                reset_at = ?
            WHERE id = ?
        `).run(nextReset.toISOString(), apiKey.id);

        logger.info('Reset monthly usage', {
            api_key_id: apiKey.id,
            plan: apiKey.plan_id,
            previous_usage: apiKey.used_count
        });

        return { ...apiKey, used_count: 0, reset_at: nextReset.toISOString() };
    }

    return apiKey;
};

/**
 * Check quota - SOFT enforcement (log only, don't block yet)
 */
const checkQuotaSoft = (key, requestId) => {
    const apiKey = getApiKey(key);

    if (!apiKey) {
        logger.warn('API key not found', { key: key.substring(0, 10), request_id: requestId });
        return { allowed: false, reason: 'invalid_key' };
    }

    // Check if sandbox
    const isSandbox = key.startsWith('sk_test_');

    // Reset cycle if needed
    const updatedKey = checkAndResetCycle(apiKey);

    const planLimits = PLAN_LIMITS[updatedKey.plan_id] || PLAN_LIMITS.free;
    const limit = updatedKey.monthly_limit || planLimits.monthly_limit;

    // SOFT CHECK - log but don't block
    const wouldExceed = updatedKey.used_count >= limit;

    if (wouldExceed) {
        logger.warn('Quota would be exceeded (not blocking yet)', {
            api_key_id: updatedKey.id,
            plan: updatedKey.plan_id,
            used: updatedKey.used_count,
            limit: limit,
            request_id: requestId,
            sandbox: isSandbox
        });
    } else {
        logger.info('Quota check passed', {
            api_key_id: updatedKey.id,
            plan: updatedKey.plan_id,
            used: updatedKey.used_count,
            limit: limit,
            remaining: limit - updatedKey.used_count,
            request_id: requestId,
            sandbox: isSandbox
        });
    }

    return {
        allowed: true, // Always allow for now (soft enforcement)
        wouldBlock: wouldExceed, // Flag for monitoring
        apiKey: updatedKey,
        remaining: limit - updatedKey.used_count,
        limit: limit,
        used: updatedKey.used_count,
        reset_at: updatedKey.reset_at,
        sandbox: isSandbox
    };
};

/**
 * Increment usage counter
 */
const incrementUsage = (apiKeyId, requestId) => {
    db.prepare(`
        UPDATE api_keys 
        SET used_count = used_count + 1,
            last_used_at = ?
        WHERE id = ?
    `).run(new Date().toISOString(), apiKeyId);

    logger.info('Incremented usage', {
        api_key_id: apiKeyId,
        request_id: requestId
    });
};

/**
 * Get plan limits
 */
const getPlanLimits = (planId) => {
    return PLAN_LIMITS[planId] || PLAN_LIMITS.free;
};

/**
 * Get quota status
 */
const getQuotaStatus = (apiKey) => {
    const updatedKey = checkAndResetCycle(apiKey);
    const planLimits = PLAN_LIMITS[updatedKey.plan_id] || PLAN_LIMITS.free;
    const limit = updatedKey.monthly_limit || planLimits.monthly_limit;

    return {
        plan: updatedKey.plan_id,
        used: updatedKey.used_count,
        limit: limit,
        remaining: Math.max(0, limit - updatedKey.used_count),
        reset_at: updatedKey.reset_at,
        percentage_used: ((updatedKey.used_count / limit) * 100).toFixed(2)
    };
};

module.exports = {
    PLAN_LIMITS,
    getApiKey,
    checkQuotaSoft,
    incrementUsage,
    getPlanLimits,
    getQuotaStatus,
    checkAndResetCycle
};
