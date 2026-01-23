const logger = require('./logger');

/**
 * Custom API Error Classes
 * Provides developer-friendly error responses with clear codes and documentation links
 */

class APIError extends Error {
    constructor(code, message, statusCode, details = {}, requestId = null) {
        super(message);
        this.name = 'APIError';
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;
        this.requestId = requestId;
        this.docs_url = `https://docs.shrinkix.com/errors/${code}`;

        // Log error
        logger.error(`API Error: ${code}`, { message, details, request_id: requestId });
    }

    toJSON() {
        const response = {
            error: this.code,
            message: this.message,
            request_id: this.requestId
        };

        // Include details if present (machine-readable context)
        if (this.details && Object.keys(this.details).length > 0) {
            response.details = this.details;
        }

        // Always include docs URL
        response.docs_url = this.docs_url;

        return response;
    }
}

// Specific Error Types
class QuotaExceededError extends APIError {
    constructor(details = {}, requestId = null) {
        // ✅ CORRECTED: Use 429 (not 402)
        super(
            'PLAN_LIMIT_REACHED',
            `Monthly limit of ${details.limit} images exceeded`,
            429,
            details,
            requestId
        );

        // Calculate seconds until reset for Retry-After header
        if (details.reset_at) {
            const resetDate = new Date(details.reset_at);
            const now = new Date();
            this.retryAfter = Math.max(0, Math.floor((resetDate - now) / 1000));
        }
    }
}

class ValidationError extends APIError {
    constructor(code, message, details = {}) {
        super(code, message, 400, details);
    }
}

class FeatureNotAvailableError extends APIError {
    constructor(feature, currentPlan, requiredPlan) {
        super(
            'FEATURE_NOT_AVAILABLE',
            `Feature '${feature}' requires ${requiredPlan} plan or higher`,
            403,
            {
                feature,
                your_plan: currentPlan,
                required_plan: requiredPlan,
                upgrade_url: '/pricing'
            }
        );
    }
}

class RateLimitError extends APIError {
    constructor(limit, window) {
        super(
            'RATE_LIMIT_EXCEEDED',
            `Rate limit exceeded. Max ${limit} requests per ${window}`,
            429,
            { limit, window }
        );
    }
}

// Specific validation errors
class ImageSizeExceededError extends ValidationError {
    constructor(maxSize, actualSize) {
        super(
            'IMAGE_SIZE_EXCEEDED',
            `File size ${actualSize} bytes exceeds plan limit of ${maxSize} bytes`,
            {
                max_size: maxSize,
                your_size: actualSize,
                max_size_mb: (maxSize / 1024 / 1024).toFixed(2),
                your_size_mb: (actualSize / 1024 / 1024).toFixed(2)
            }
        );
        this.statusCode = 413;
    }
}

class UnsupportedFormatError extends ValidationError {
    constructor(format, supportedFormats) {
        super(
            'UNSUPPORTED_FORMAT',
            `Format '${format}' is not supported on your plan`,
            {
                your_format: format,
                supported: supportedFormats
            }
        );
        this.statusCode = 415;
    }
}

class ResolutionExceededError extends ValidationError {
    constructor(width, height, maxPixels) {
        super(
            'RESOLUTION_EXCEEDED',
            `Image resolution ${width}x${height} exceeds plan limit`,
            {
                your_resolution: `${width}x${height}`,
                your_pixels: width * height,
                max_pixels: maxPixels,
                max_resolution_approx: `${Math.floor(Math.sqrt(maxPixels))}x${Math.floor(Math.sqrt(maxPixels))}`
            }
        );
        this.statusCode = 413;
    }
}

class CorruptedImageError extends ValidationError {
    constructor() {
        super(
            'CORRUPTED_IMAGE',
            'Image file is corrupted or invalid',
            {}
        );
    }
}

class TransformationLimitExceededError extends ValidationError {
    constructor(requested, allowed, plan) {
        super(
            'TRANSFORMATION_LIMIT_EXCEEDED',
            `Too many operations. ${plan} plan allows max ${allowed} operations`,
            {
                requested_operations: requested,
                allowed_operations: allowed,
                your_plan: plan
            }
        );
    }
}

// Error handler middleware
const errorHandler = (err, req, res, next) => {
    // If it's our custom API error
    if (err instanceof APIError) {
        return res.status(err.statusCode).json(err.toJSON());
    }

    // Handle multer errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        const error = new ImageSizeExceededError(
            req.user?.maxFileSize || 5242880,
            err.limit
        );
        return res.status(error.statusCode).json(error.toJSON());
    }

    // Log unexpected errors
    logger.error('Unexpected error:', err);

    // Generic 500 error (only for real server errors)
    res.status(500).json({
        error: 'INTERNAL_SERVER_ERROR',
        message: process.env.NODE_ENV === 'production'
            ? 'An unexpected error occurred'
            : err.message,
        docs_url: 'https://docs.shrinkix.com/errors/INTERNAL_SERVER_ERROR'
    });
};

module.exports = {
    APIError,
    QuotaExceededError,
    ValidationError,
    FeatureNotAvailableError,
    RateLimitError,
    ImageSizeExceededError,
    UnsupportedFormatError,
    ResolutionExceededError,
    CorruptedImageError,
    TransformationLimitExceededError,
    errorHandler
};
