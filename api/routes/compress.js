const express = require("express");
const multer = require("multer");
const { compressImage } = require("../controllers/compressController");

const router = express.Router();

const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Preserve the original extension
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1E9) + ext;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/png", "image/jpeg", "image/webp"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only PNG, JPG and WebP images are allowed"));
    }
    cb(null, true);
  }
});

/**
 * Health check
 */
router.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Image Compress API is running. Use POST to upload image."
  });
});

/**
 * Compress image
 */
router.post("/", upload.single("image"), compressImage);

module.exports = router;
