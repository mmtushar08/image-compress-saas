const express = require("express");
const multer = require("multer");
const { compressImage, compressBatch } = require("../controllers/compressController");
const { sanitizeFilename, validateFileSize, validateFileContent } = require("../utils/fileValidation");



const router = express.Router();

// Custom Anonymous Rate Limiter (Daily limit resetting at midnight)
// Uses the same logic as check-limit endpoint for consistency
const { checkGuestLimit } = require("../controllers/userController");

const anonymousLimiter = (req, res, next) => {
  // Skip if user is logged in (Plan limits apply in controller)
  if (req.user) return next();

  // Check limits using shared controller logic
  const limitStats = checkGuestLimit(req.ip);

  if (limitStats.remaining <= 0) {
    return res.status(429).json({
      success: false,
      error: "Daily guest limit reached (10/day). Please sign up for more."
    });
  }
  next();
};

const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    try {
      // Sanitize filename to prevent path traversal and injection
      const sanitized = sanitizeFilename(file.originalname);
      const ext = path.extname(sanitized);
      const baseName = path.basename(sanitized, ext);
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${baseName}${ext}`;
      cb(null, uniqueName);
    } catch (error) {
      cb(new Error("Invalid filename"), null);
    }
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit (Enterprise)
    files: 10, // Max 10 files for batch
    fieldSize: 10 * 1024 * 1024 // 10MB field size limit
  },
  fileFilter: async (req, file, cb) => {
    try {
      // Validate MIME type
      const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
      if (!allowed.includes(file.mimetype)) {
        const err = new Error("Only PNG, JPG and WebP images are allowed");
        err.code = "INVALID_FILE_TYPE";
        err.status = 400;
        return cb(err);
      }

      // Validate file size (additional check)
      const sizeValidation = validateFileSize(file.size);
      if (!sizeValidation.valid) {
        const err = new Error(sizeValidation.error);
        err.code = "LIMIT_FILE_SIZE";
        err.status = 413;
        return cb(err);
      }

      cb(null, true);
    } catch (error) {
      cb(error);
    }
  }
});

/**
 * Single Image Compression
 * Returns binary image
 */
router.post("/", anonymousLimiter, upload.single("image"), compressImage);

/**
 * Batch Compression
 * Returns ZIP file with compressed images
 */
router.post("/batch", anonymousLimiter, upload.array("images[]"), compressBatch);

/**
 * Result Download
 */
router.get("/download/:filename", require("../controllers/compressController").downloadResult);

// Helpful message for GET requests
router.get("/batch", (req, res) => {
  res.status(405).json({
    error: "Method not allowed",
    message: "Batch compression requires POST method with multipart/form-data",
    usage: {
      method: "POST",
      endpoint: "/api/compress/batch",
      contentType: "multipart/form-data",
      fieldName: "images[]",
      example: "curl -X POST http://localhost:5000/api/compress/batch -F 'images[]=@image1.png' -F 'images[]=@image2.jpg'"
    }
  });
});

module.exports = router;
