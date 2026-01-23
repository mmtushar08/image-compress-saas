const express = require("express");
const multer = require("multer");
const { compressImage, compressBatch } = require("../controllers/compressController");
const { sanitizeFilename, validateFileSize, validateFileContent } = require("../utils/fileValidation");
const { universalParser } = require("../middleware/universalParser");



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
      message: "Daily guest limit reached (25/day). Please sign up for more."
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
    fileSize: 200 * 1024 * 1024,
    files: 10
  }
});

/**
 * Single Image Compression
 * Returns binary image
 */
router.post("/", anonymousLimiter, universalParser, compressImage);

/**
 * TinyPNG-compatible endpoint alias
 */
router.post("/shrink", anonymousLimiter, universalParser, compressImage);

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
