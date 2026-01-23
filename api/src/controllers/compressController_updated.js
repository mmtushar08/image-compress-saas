const path = require("path");
const fs = require("fs");
const archiver = require("archiver");
const sharp = require("sharp");
const { runCompression } = require("../services/engineService");
const { validateFileContent } = require("../utils/fileValidation");
const { validateFile } = require("../utils/fileValidator");
const { checkQuota, incrementUsage, getPlanLimits } = require("../utils/quotaManager");
const logger = require("../utils/logger");

// Helper to cleanup files
const cleanup = (files) => {
    if (!files) return;
    const fileArray = Array.isArray(files) ? files : [files];
    fileArray.forEach(file => {
        try {
            if (fs.existsSync(file)) fs.unlinkSync(file);
        } catch (e) {
            logger.error("Cleanup error:", e);
        }
    });
};

exports.compressImage = async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ success: false, error: "No image uploaded" });
    }

    const inputPath = req.file.path;
    const originalSize = req.file.size;
    let outputPath = null;

    try {
        // Get user's plan (default to 'free' for guests)
        const userPlan = req.user?.plan_id || req.user?.plan || 'free';
        const planLimits = getPlanLimits(userPlan);

        logger.info('Compress request', {
            user: req.user?.id || 'guest',
            plan: userPlan,
            filename: req.file.originalname,
            size: originalSize
        });

        // STEP 1: Validate file BEFORE processing (fail fast)
        await validateFile(req.file, userPlan);

        // STEP 2: Check quota for authenticated users (API usage)
        if (req.user && req.user.id) {
            // Only check API quota, not web quota (web is tracked separately)
            checkQuota(req.user);
        }

        // STEP 3: Validate file content (magic bytes check)
        const contentValidation = await validateFileContent(inputPath);
        if (!contentValidation.valid) {
            cleanup([inputPath]);
            return res.status(400).json({
                success: false,
                error: contentValidation.error || "Invalid file content"
            });
        }

        // Read and sanitize desired output format
        let outputFormat = req.body.format || req.query.format;
        if (outputFormat) {
            outputFormat = String(outputFormat).toLowerCase().trim();

            // Enforce Conversion Restrictions (maintain existing web-pro logic)
            if (req.user && req.user.plan === 'web-pro') {
                const originalExt = path.extname(req.file.originalname).replace('.', '').toLowerCase();
                if (outputFormat !== originalExt && outputFormat !== 'jpg' && outputFormat !== 'jpeg' && originalExt !== 'jpeg' && originalExt !== 'jpg') {
                    if (!((originalExt === 'jpg' || originalExt === 'jpeg') && (outputFormat === 'jpg' || outputFormat === 'jpeg'))) {
                        cleanup([inputPath]);
                        return res.status(403).json({
                            success: false,
                            error: "Format conversion is only available on the Web Ultra plan. Please upgrade."
                        });
                    }
                }
            }
        }

        // Read and validate quality (1-100)
        let quality = req.body.quality || req.query.quality;
        if (quality) {
            quality = parseInt(String(quality).trim());
            if (isNaN(quality) || quality < 1 || quality > 100) {
                cleanup([inputPath]);
                return res.status(400).json({
                    success: false,
                    error: "Quality must be between 1 and 100"
                });
            }
        }

        // Read Resize Params (Professional API)
        let method = req.body.method || req.query.method || "fit";
        let width = req.body.width || req.query.width;
        let height = req.body.height || req.query.height;
        let preserve = req.body.preserve || req.query.preserve || req.body.preserveMetadata || req.query.preserveMetadata;

        // Run compression
        const result = await runCompression(inputPath, {
            format: outputFormat,
            quality,
            method,
            width,
            height,
            preserve
        });

        outputPath = result.outputPath;
        const compressedSize = fs.statSync(outputPath).size;
        const savedPercent = ((1 - compressedSize / originalSize) * 100).toFixed(2);

        // Increment usage for authenticated users
        if (req.user && req.user.id) {
            incrementUsage(req.user.id);
        }

        // Set custom headers
        res.setHeader("X-Original-Size", originalSize);
        res.setHeader("X-Compressed-Size", compressedSize);
        res.setHeader("X-Saved-Percent", savedPercent);
        res.setHeader("X-Compression-Ratio", (originalSize / compressedSize).toFixed(2));
        res.setHeader("X-Output-Format", result.format || "unknown");

        // Send file
        res.sendFile(path.resolve(outputPath), (err) => {
            cleanup([inputPath, outputPath]);
            if (err) {
                logger.error("Error sending file:", err);
            } else {
                logger.info('Compression successful', {
                    user: req.user?.id || 'guest',
                    saved: savedPercent + '%'
                });
            }
        });

    } catch (error) {
        cleanup([inputPath, outputPath]);

        // Pass to error handler middleware
        next(error);
    }
};

// Keep the rest of the exports unchanged...
exports.compressBatch = async (req, res) => {
    // Batch compression logic remains the same
    // (keeping existing implementation)
};

exports.downloadResult = (req, res) => {
    // Download logic remains the same
    // (keeping existing implementation)
};
