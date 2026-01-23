const { PLAN_LIMITS } = require('./quotaManager');
const { FeatureNotAvailableError, TransformationLimitExceededError } = require('./errors');
const logger = require('./logger');

/**
 * Feature Gates
 * Controls access to features based on plan
 */

/**
 * Check if a feature is available for a plan
 */
const isFeatureAvailable = (feature, plan) => {
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
    return limits.features.includes(feature);
};

/**
 * Get minimum plan required for a feature
 */
const getMinimumPlan = (feature) => {
    const planOrder = ['free', 'starter', 'pro', 'business'];

    for (const plan of planOrder) {
        if (PLAN_LIMITS[plan].features.includes(feature)) {
            return plan;
        }
    }

    return 'business';
};

/**
 * Check feature access - throws error if not available
 */
const checkFeatureAccess = (feature, plan) => {
    if (!isFeatureAvailable(feature, plan)) {
        const requiredPlan = getMinimumPlan(feature);
        throw new FeatureNotAvailableError(feature, plan, requiredPlan);
    }

    logger.info('Feature access granted', { feature, plan });
    return true;
};

/**
 * Validate operation count against plan limits
 */
const validateOperationCount = (operations, plan) => {
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
    const operationCount = operations.length;

    if (operationCount > limits.max_operations) {
        throw new TransformationLimitExceededError(
            operationCount,
            limits.max_operations,
            plan
        );
    }

    return true;
};

/**
 * Parse and validate requested operations from request
 */
const parseOperations = (req, plan) => {
    const operations = [];

    // Check for resize
    if (req.body.width || req.body.height || req.query.width || req.query.height) {
        checkFeatureAccess('resize', plan);
        operations.push({
            type: 'resize',
            width: parseInt(req.body.width || req.query.width),
            height: parseInt(req.body.height || req.query.height)
        });
    }

    // Check for crop
    if (req.body.crop || req.query.crop) {
        checkFeatureAccess('crop', plan);
        operations.push({
            type: 'crop',
            params: req.body.crop || req.query.crop
        });
    }

    // Check for format conversion
    const outputFormat = req.body.output || req.query.output;
    if (outputFormat) {
        if (outputFormat === 'avif') {
            checkFeatureAccess('avif', plan);
        }
        operations.push({
            type: 'convert',
            format: outputFormat
        });
    }

    // Check for metadata control
    if (req.body.preserveMetadata !== undefined || req.query.preserveMetadata !== undefined) {
        checkFeatureAccess('metadata', plan);
        operations.push({
            type: 'metadata',
            preserve: req.body.preserveMetadata === 'true' || req.query.preserveMetadata === 'true'
        });
    }

    // Compression is always included
    operations.push({
        type: 'compress',
        quality: parseInt(req.body.quality || req.query.quality || 80)
    });

    // Validate operation count
    validateOperationCount(operations, plan);

    logger.info('Operations parsed and validated', {
        plan,
        operations: operations.map(op => op.type)
    });

    return operations;
};

/**
 * Get all available features for a plan
 */
const getAvailableFeatures = (plan) => {
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
    return {
        plan,
        features: limits.features,
        max_operations: limits.max_operations,
        max_file_size: limits.max_file_size,
        max_resolution: limits.max_resolution,
        allowed_formats: limits.allowed_formats
    };
};

module.exports = {
    isFeatureAvailable,
    getMinimumPlan,
    checkFeatureAccess,
    validateOperationCount,
    parseOperations,
    getAvailableFeatures
};
