const sharp = require('sharp');
const path = require('path');
const { PLAN_LIMITS } = require('./quotaManager');
const logger = require('./logger');

/**
 * File Validator (Corrected)
 * Validates files BEFORE processing to fail fast and save CPU
 * Uses maxPixels (not maxResolution) and includes safety guards
 */

/**
 * Custom validation errors (will be replaced by errors.js)
 */
class ValidationError extends Error {
    constructor(code, message, statusCode, details = {}) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;
    }
}

/**
 * Validate file size
 */
const validateFileSize = (file, plan, requestId) => {
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;

    if (file.size > limits.max_file_size) {
        logger.warn('File size exceeded', {
            request_id: requestId,
            plan,
            max: limits.max_file_size,
            actual: file.size
        });

        throw new ValidationError(
            'IMAGE_SIZE_EXCEEDED',
            `File size ${file.size} bytes exceeds plan limit of ${limits.max_file_size} bytes`,
            413,
            {
                max_size: limits.max_file_size,
                your_size: file.size,
                max_size_mb: (limits.max_file_size / 1024 / 1024).toFixed(2),
                your_size_mb: (file.size / 1024 / 1024).toFixed(2)
            }
        );
    }

    return true;
};

/**
 * Validate file format
 */
const validateFileFormat = (file, plan, requestId) => {
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
    const ext = path.extname(file.originalname || file.name).toLowerCase().replace('.', '');

    if (!limits.allowed_formats.includes(ext)) {
        logger.warn('Unsupported format', {
            request_id: requestId,
            plan,
            format: ext,
            allowed: limits.allowed_formats
        });

        throw new ValidationError(
            'UNSUPPORTED_FORMAT',
            `Format '${ext}' is not supported on ${plan} plan`,
            415,
            {
                your_format: ext,
                supported: limits.allowed_formats
            }
        );
    }

    return true;
};

/**
 * Validate image resolution (CORRECTED with safety guards)
 */
const validateResolution = async (filePath, plan, requestId) => {
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;

    try {
        const metadata = await sharp(filePath).metadata();

        // ✅ SAFETY GUARD: Check if dimensions are readable
        if (!metadata.width || !metadata.height) {
            logger.error('Unable to read image dimensions', {
                request_id: requestId,
                metadata
            });

            throw new ValidationError(
                'INVALID_IMAGE',
                'Unable to read image dimensions',
                400,
                {}
            );
        }

        const pixels = metadata.width * metadata.height;

        // Use maxPixels (not maxResolution)
        if (pixels > limits.maxPixels) {
            logger.warn('Resolution exceeded', {
                request_id: requestId,
                plan,
                width: metadata.width,
                height: metadata.height,
                pixels,
                max_pixels: limits.maxPixels
            });

            throw new ValidationError(
                'RESOLUTION_EXCEEDED',
                `Image resolution ${metadata.width}x${metadata.height} exceeds plan limit`,
                413,
                {
                    your_resolution: `${metadata.width}x${metadata.height}`,
                    your_pixels: pixels,
                    max_pixels: limits.maxPixels,
                    max_resolution_approx: `${Math.floor(Math.sqrt(limits.maxPixels))}x${Math.floor(Math.sqrt(limits.maxPixels))}`
                }
            );
        }

        return {
            width: metadata.width,
            height: metadata.height,
            format: metadata.format,
            pixels
        };
    } catch (err) {
        // If it's our validation error, re-throw
        if (err instanceof ValidationError) {
            throw err;
        }

        // Otherwise, it's a corrupted image
        logger.error('Image validation failed', {
            request_id: requestId,
            error: err.message
        });

        throw new ValidationError(
            'CORRUPTED_IMAGE',
            'Image file is corrupted or invalid',
            400,
            {}
        );
    }
};

/**
 * Check if file is corrupted
 */
const validateImageIntegrity = async (filePath, requestId) => {
    try {
        // Try to get stats - if this fails, image is corrupted
        await sharp(filePath).stats();
        return true;
    } catch (err) {
        logger.error('Image integrity check failed', {
            request_id: requestId,
            error: err.message
        });

        throw new ValidationError(
            'CORRUPTED_IMAGE',
            'Image file is corrupted or invalid',
            400,
            {}
        );
    }
};

/**
 * Complete file validation
 * Run ALL validations before processing
 */
const validateFile = async (file, plan, requestId) => {
    logger.info('Validating file', {
        request_id: requestId,
        filename: file.originalname || file.name,
        size: file.size,
        plan: plan
    });

    // 1. File size (fast check)
    validateFileSize(file, plan, requestId);

    // 2. File format (fast check)
    validateFileFormat(file, plan, requestId);

    // 3. Image integrity (requires reading file)
    await validateImageIntegrity(file.path, requestId);

    // 4. Resolution (requires metadata) - with safety guards
    const metadata = await validateResolution(file.path, plan, requestId);

    logger.info('File validation passed', {
        request_id: requestId,
        filename: file.originalname || file.name,
        metadata
    });

    return {
        valid: true,
        metadata
    };
};

/**
 * Validate batch of files
 */
const validateBatch = async (files, plan, requestId) => {
    const results = [];

    for (const file of files) {
        try {
            const result = await validateFile(file, plan, requestId);
            results.push({ file: file.originalname, ...result });
        } catch (err) {
            // Re-throw first validation error
            throw err;
        }
    }

    return results;
};

module.exports = {
    validateFile,
    validateBatch,
    validateFileSize,
    validateFileFormat,
    validateResolution,
    validateImageIntegrity,
    ValidationError // Export for now, will use errors.js later
};
