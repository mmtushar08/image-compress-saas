const { PLAN_LIMITS } = require('../utils/quotaManager');
const { buildLimitsResponse } = require('../utils/responseBuilder');

/**
 * GET /api/v1/limits
 * Returns plan limits for the authenticated user
 * Helps SDKs and dashboards understand capabilities
 */
exports.getLimits = (req, res) => {
    try {
        const userPlan = req.user?.plan_id || req.user?.plan || 'free';
        const planLimits = PLAN_LIMITS[userPlan] || PLAN_LIMITS.free;

        const response = buildLimitsResponse(userPlan, planLimits);

        res.json(response);
    } catch (error) {
        res.status(500).json({
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to fetch limits',
            request_id: req.id
        });
    }
};

/**
 * POST /api/v1/validate
 * Validates image before upload
 * Reduces wasted uploads
 */
exports.validateImage = async (req, res) => {
    try {
        const { fileSize, format, width, height } = req.body;
        const userPlan = req.user?.plan_id || req.user?.plan || 'free';
        const planLimits = PLAN_LIMITS[userPlan] || PLAN_LIMITS.free;

        const warnings = [];
        let valid = true;

        // Check file size
        if (fileSize > planLimits.max_file_size) {
            valid = false;
            warnings.push({
                code: 'FILE_SIZE_EXCEEDED',
                message: `File size ${(fileSize / 1024 / 1024).toFixed(2)}MB exceeds plan limit of ${(planLimits.max_file_size / 1024 / 1024).toFixed(0)}MB`
            });
        }

        // Check format
        if (format && !planLimits.allowed_formats.includes(format.toLowerCase())) {
            valid = false;
            warnings.push({
                code: 'UNSUPPORTED_FORMAT',
                message: `Format '${format}' not supported on ${userPlan} plan`
            });
        }

        // Check resolution
        if (width && height) {
            const pixels = width * height;
            if (pixels > planLimits.maxPixels) {
                valid = false;
                warnings.push({
                    code: 'RESOLUTION_EXCEEDED',
                    message: `Resolution ${width}x${height} exceeds plan limit`
                });
            }
        }

        res.json({
            valid,
            warnings,
            plan: userPlan,
            limits: {
                max_file_size_mb: (planLimits.max_file_size / 1024 / 1024).toFixed(0),
                max_pixels: planLimits.maxPixels,
                allowed_formats: planLimits.allowed_formats
            }
        });
    } catch (error) {
        res.status(500).json({
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Validation failed',
            request_id: req.id
        });
    }
};
