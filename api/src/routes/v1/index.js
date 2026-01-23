const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../../middleware/auth');
const { sandboxMode } = require('../../middleware/sandboxMode');
const { addRateLimitHeaders } = require('../../middleware/rateLimitHeaders');
const { optimize } = require('../../controllers/optimizeController');

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max (will be validated by plan)
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp|avif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only image files (JPG, PNG, WebP, AVIF) are allowed'));
        }
    }
});

/**
 * @route   POST /api/v1/optimize
 * @desc    Single, powerful optimization endpoint
 * @access  Public (with API key) or Authenticated
 * 
 * Request (multipart/form-data):
 * - image: File (required)
 * - resize: JSON { width, height, fit }
 * - crop: JSON { mode, ratio }
 * - format: string (jpg|png|webp|avif)
 * - quality: number (1-100)
 * - metadata: string (strip|keep)
 */
router.post('/optimize',
    authMiddleware,
    sandboxMode,
    addRateLimitHeaders,
    upload.single('image'),
    optimize
);

/**
 * @route   GET /api/v1/limits
 * @desc    Get plan limits for authenticated user
 * @access  Private
 */
const { getLimits, validateImage } = require('../../controllers/utilityController');
router.get('/limits', authMiddleware, addRateLimitHeaders, getLimits);

/**
 * @route   POST /api/v1/validate
 * @desc    Validate image before upload
 * @access  Private
 */
router.post('/validate', authMiddleware, addRateLimitHeaders, validateImage);

module.exports = router;
