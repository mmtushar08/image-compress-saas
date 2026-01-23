/**
 * Operation Counter
 * Counts operations for plan limit enforcement
 * 
 * Rule: Compression ALWAYS counts as 1 operation
 * - Compress only = 1
 * - Compress + resize = 2
 * - Compress + resize + crop = 3
 */

const logger = require('./logger');

/**
 * Count operations from request parameters
 */
const countOperations = (params) => {
    let count = 1; // Compression always counts as 1

    // Resize operation
    if (params.resize && (params.resize.width || params.resize.height)) {
        count++;
    }

    // Crop operation
    if (params.crop && params.crop.mode) {
        count++;
    }

    // Format conversion (if different from original)
    // Note: This will be checked during processing
    if (params.format) {
        count++;
    }

    // Metadata preservation (Business only)
    if (params.metadata === 'keep') {
        count++;
    }

    return count;
};

/**
 * Validate operation count against plan limits
 */
const validateOperationCount = (operationCount, plan, requestId) => {
    const OPERATION_LIMITS = {
        free: 1,
        'web-pro': 2,
        'web-ultra': 3,
        starter: 2,
        pro: 3,
        'api-pro': 2,
        'api-ultra': 3,
        business: 4
    };

    const maxOperations = OPERATION_LIMITS[plan] || 1;

    if (operationCount > maxOperations) {
        logger.warn('Operation limit exceeded', {
            request_id: requestId,
            plan,
            requested: operationCount,
            allowed: maxOperations
        });

        return {
            valid: false,
            requested: operationCount,
            allowed: maxOperations,
            plan
        };
    }

    logger.info('Operation count validated', {
        request_id: requestId,
        plan,
        operations: operationCount,
        allowed: maxOperations
    });

    return {
        valid: true,
        requested: operationCount,
        allowed: maxOperations
    };
};

/**
 * Get operation breakdown for response
 */
const getOperationBreakdown = (params) => {
    const operations = ['compress']; // Always included

    if (params.resize && (params.resize.width || params.resize.height)) {
        operations.push('resize');
    }

    if (params.crop && params.crop.mode) {
        operations.push('crop');
    }

    if (params.format) {
        operations.push('convert');
    }

    if (params.metadata === 'keep') {
        operations.push('metadata');
    }

    return operations;
};

module.exports = {
    countOperations,
    validateOperationCount,
    getOperationBreakdown
};
