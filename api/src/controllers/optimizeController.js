const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { runCompression } = require('../services/engineService');
const { validateFile } = require('../utils/fileValidator');
const { checkQuotaSoft, incrementUsage } = require('../utils/quotaManager');
const { countOperations, validateOperationCount, getOperationBreakdown } = require('../utils/operationCounter');
const { buildOptimizeResponse } = require('../utils/responseBuilder');
const { validateSandboxLimits } = require('../middleware/sandboxMode');
const logger = require('../utils/logger');

/**
 * POST /api/v1/optimize
 * Single, powerful optimization endpoint
 * 
 * Handles: compression, resize, crop, format conversion, metadata
 */
exports.optimize = async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({
            error: 'NO_IMAGE_PROVIDED',
            message: 'No image file provided',
            request_id: req.id
        });
    }

    const inputPath = req.file.path;
    let outputPath = null;

    try {
        // Get user's plan
        const userPlan = req.user?.plan_id || req.user?.plan || 'free';

        logger.info('Optimize request', {
            request_id: req.id,
            user: req.user?.id || 'guest',
            plan: userPlan,
            filename: req.file.originalname,
            size: req.file.size,
            sandbox: req.sandbox || false
        });

        // Parse operation parameters
        const params = {
            resize: req.body.resize ? JSON.parse(req.body.resize) : null,
            crop: req.body.crop ? JSON.parse(req.body.crop) : null,
            format: req.body.format,
            quality: req.body.quality ? parseInt(req.body.quality) : 80,
            metadata: req.body.metadata || 'strip'
        };

        // STEP 1: Count operations
        const operationCount = countOperations(params);
        const operationBreakdown = getOperationBreakdown(params);

        // STEP 2: Validate operation count
        const opValidation = validateOperationCount(operationCount, userPlan, req.id);
        if (!opValidation.valid) {
            cleanup([inputPath]);
            return res.status(400).json({
                error: 'OPERATION_LIMIT_EXCEEDED',
                message: `Too many operations. ${userPlan} plan allows max ${opValidation.allowed} operations`,
                request_id: req.id,
                details: {
                    requested_operations: opValidation.requested,
                    allowed_operations: opValidation.allowed,
                    your_plan: userPlan,
                    operations: operationBreakdown
                }
            });
        }

        // STEP 3: Validate file (sandbox or regular limits)
        if (req.sandbox) {
            const sandboxValidation = validateSandboxLimits(req, req.file);
            if (!sandboxValidation.valid) {
                cleanup([inputPath]);
                return res.status(400).json({
                    error: sandboxValidation.error,
                    message: sandboxValidation.message,
                    request_id: req.id,
                    details: sandboxValidation.details
                });
            }
        }

        await validateFile(req.file, userPlan, req.id);

        // STEP 4: Check quota (skip for sandbox)
        let quotaStatus;
        if (req.user && req.user.id && !req.sandbox) {
            quotaStatus = checkQuotaSoft(req.user.apiKey, req.id);
            if (quotaStatus.wouldBlock) {
                cleanup([inputPath]);
                return res.status(429).json({
                    error: 'PLAN_LIMIT_REACHED',
                    message: `Monthly limit of ${quotaStatus.limit} images exceeded`,
                    request_id: req.id,
                    details: {
                        used: quotaStatus.used,
                        limit: quotaStatus.limit,
                        reset_at: quotaStatus.reset_at
                    }
                });
            }
        }

        // STEP 5: Get original metadata
        const originalMetadata = await sharp(inputPath).metadata();
        const originalSize = req.file.size;

        // STEP 6: Run optimization
        const result = await runCompression(inputPath, {
            format: params.format,
            quality: params.quality,
            method: params.resize?.fit || 'fit',
            width: params.resize?.width,
            height: params.resize?.height,
            preserve: params.metadata === 'keep'
        });

        outputPath = result.outputPath;
        const optimizedMetadata = await sharp(outputPath).metadata();
        const optimizedSize = fs.statSync(outputPath).size;

        // STEP 7: Increment usage (skip for sandbox)
        if (req.user && req.user.id && !req.sandbox) {
            incrementUsage(req.user.id);
        }

        // STEP 8: Build response
        const response = buildOptimizeResponse(
            {
                size: originalSize,
                format: originalMetadata.format,
                width: originalMetadata.width,
                height: originalMetadata.height
            },
            {
                size: optimizedSize,
                format: optimizedMetadata.format,
                width: optimizedMetadata.width,
                height: optimizedMetadata.height
            },
            {
                used: quotaStatus?.used + 1 || 0,
                limit: quotaStatus?.limit || 0,
                remaining: quotaStatus?.remaining - 1 || 0
            },
            operationBreakdown
        );

        // Send file with metadata in headers
        res.setHeader('X-Original-Size', originalSize);
        res.setHeader('X-Optimized-Size', optimizedSize);
        res.setHeader('X-Savings-Percent', response.savings.percent);
        res.setHeader('X-Operations', operationBreakdown.join(','));

        res.sendFile(path.resolve(outputPath), (err) => {
            cleanup([inputPath, outputPath]);
            if (err) {
                logger.error('Error sending file', { error: err, request_id: req.id });
            } else {
                logger.info('Optimization successful', {
                    request_id: req.id,
                    savings: response.savings.percent + '%',
                    operations: operationBreakdown
                });
            }
        });

    } catch (error) {
        cleanup([inputPath, outputPath]);
        next(error);
    }
};

// Helper to cleanup files
const cleanup = (files) => {
    if (!files) return;
    const fileArray = Array.isArray(files) ? files : [files];
    fileArray.forEach(file => {
        try {
            if (fs.existsSync(file)) fs.unlinkSync(file);
        } catch (e) {
            logger.error('Cleanup error', { error: e });
        }
    });
};
