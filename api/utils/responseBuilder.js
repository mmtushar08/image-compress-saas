/**
 * Response Builder
 * Builds standardized API responses
 */

/**
 * Build success response for /optimize endpoint
 */
const buildOptimizeResponse = (original, optimized, usage, operations) => {
    const savings = {
        bytes: original.size - optimized.size,
        percent: parseFloat(((1 - optimized.size / original.size) * 100).toFixed(1))
    };

    return {
        success: true,
        original: {
            size: original.size,
            format: original.format,
            width: original.width,
            height: original.height
        },
        optimized: {
            size: optimized.size,
            format: optimized.format,
            width: optimized.width,
            height: optimized.height
        },
        savings,
        operations: operations || [],
        usage: {
            used: usage.used,
            limit: usage.limit,
            remaining: usage.remaining
        }
    };
};

/**
 * Build error response
 */
const buildErrorResponse = (error, requestId) => {
    return {
        error: error.code || 'UNKNOWN_ERROR',
        message: error.message,
        request_id: requestId,
        details: error.details || {},
        docs_url: error.docs_url || 'https://docs.shrinkix.com/errors'
    };
};

/**
 * Build validation response
 */
const buildValidationResponse = (valid, warnings = []) => {
    return {
        valid,
        warnings
    };
};

/**
 * Build limits response
 */
const buildLimitsResponse = (plan, planLimits) => {
    return {
        plan: plan,
        max_file_size_mb: (planLimits.max_file_size / 1024 / 1024).toFixed(0),
        max_pixels: planLimits.maxPixels,
        max_operations: planLimits.max_operations,
        formats: planLimits.allowed_formats,
        features: planLimits.features,
        rate_limit: planLimits.rate_limit
    };
};

module.exports = {
    buildOptimizeResponse,
    buildErrorResponse,
    buildValidationResponse,
    buildLimitsResponse
};
