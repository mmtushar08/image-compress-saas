/**
 * Sandbox Mode Middleware
 * Handles test/sandbox requests with stricter limits
 * 
 * Header: X-Mode: sandbox
 * 
 * Rules:
 * - Stricter file size limits (1MB max)
 * - Stricter operation limits (max 2)
 * - Does NOT count against real quota
 * - Clearly labeled in logs
 * - Optional watermark on output
 */

const logger = require('../utils/logger');

// Sandbox limits (stricter than production)
const SANDBOX_LIMITS = {
    max_file_size: 1 * 1024 * 1024, // 1MB
    max_operations: 2,
    max_pixels: 4000000, // 2000x2000
    daily_limit: 100,
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
};

/**
 * Check if request is in sandbox mode
 */
const isSandboxMode = (req) => {
    return req.headers['x-mode'] === 'sandbox' ||
        req.query.mode === 'sandbox' ||
        (req.user?.apiKey && req.user.apiKey.startsWith('sk_test_'));
};

/**
 * Sandbox mode middleware
 */
const sandboxMode = (req, res, next) => {
    if (isSandboxMode(req)) {
        // Mark request as sandbox
        req.sandbox = true;

        // Apply stricter limits
        req.sandboxLimits = SANDBOX_LIMITS;

        // Log clearly
        logger.info('Sandbox request detected', {
            request_id: req.id,
            user: req.user?.id || 'anonymous',
            mode: 'sandbox'
        });

        // Add header to response
        res.setHeader('X-Sandbox-Mode', 'true');
    }

    next();
};

/**
 * Validate against sandbox limits
 */
const validateSandboxLimits = (req, file) => {
    if (!req.sandbox) {
        return { valid: true };
    }

    const limits = req.sandboxLimits;

    // File size check
    if (file.size > limits.max_file_size) {
        return {
            valid: false,
            error: 'SANDBOX_FILE_SIZE_EXCEEDED',
            message: `Sandbox mode allows max ${limits.max_file_size / 1024 / 1024}MB files`,
            details: {
                max_size: limits.max_file_size,
                your_size: file.size,
                mode: 'sandbox'
            }
        };
    }

    return { valid: true };
};

/**
 * Get sandbox limits for a request
 */
const getSandboxLimits = (req) => {
    if (!req.sandbox) {
        return null;
    }

    return SANDBOX_LIMITS;
};

module.exports = {
    SANDBOX_LIMITS,
    isSandboxMode,
    sandboxMode,
    validateSandboxLimits,
    getSandboxLimits
};
