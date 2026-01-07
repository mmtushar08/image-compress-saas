const path = require("path");
const fs = require("fs");
const archiver = require("archiver");
const { runCompression } = require("../services/engineService");
const { validateFileContent } = require("../utils/fileValidation");

// Helper to cleanup files
const cleanup = (files) => {
  if (!files) return;
  const fileArray = Array.isArray(files) ? files : [files];
  fileArray.forEach(file => {
    try {
      if (fs.existsSync(file)) fs.unlinkSync(file);
    } catch (e) {
      console.error("Cleanup error:", e);
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

  // Enforce Plan Limits (Size)
  // Default for Anonymous is 5MB (matching Starter)
  let maxAllowed = 5 * 1024 * 1024;
  if (req.user && req.user.plan) {
    const { PLANS } = require("./userController"); // Access plan definitions
    maxAllowed = PLANS[req.user.plan]?.maxFileSize || maxAllowed;
  }

  if (originalSize > maxAllowed) {
    cleanup([inputPath]);
    return res.status(413).json({
      success: false,
      error: `File size exceeds your plan limit of ${maxAllowed / (1024 * 1024)}MB. Please upgrade.`
    });
  }

  try {
    // Validate file content (magic bytes check)
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
    let preserve = req.body.preserve || req.query.preserve;

    // Validate resize dimensions
    if (width) width = parseInt(String(width));
    if (height) height = parseInt(String(height));

    const allowedFormats = ["jpg", "jpeg", "png", "webp"];

    if (outputFormat && !allowedFormats.includes(outputFormat)) {
      cleanup([inputPath]);
      return res.status(400).json({
        success: false,
        error: "Invalid format. Supported: jpg, png, webp"
      });
    }

    const originalExt = path.extname(req.file.originalname);
    const finalExt = outputFormat ? `.${outputFormat}` : originalExt;

    outputPath = path.join("output", `compressed-${Date.now()}-${Math.round(Math.random() * 1E5)}${finalExt}`);

    // Ensure output dir
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    // Generate Download Filename
    const downloadFilename = req.file.originalname;
    const contentTypeMap = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.webp': 'image/webp'
    };

    // Run Engine
    await runCompression(inputPath, outputPath, outputFormat, quality, method, width, height, preserve);

    if (!fs.existsSync(outputPath)) {
      throw new Error("Compression engine failed to produce output");
    }

    const compressedSize = fs.statSync(outputPath).size;
    const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(2);
    const savedPercent = compressionRatio; // Same value, different name for API compatibility

    // Set all headers (keep for binary compat)
    res.setHeader("X-Original-Size", originalSize.toString());
    res.setHeader("X-Compressed-Size", compressedSize.toString());
    res.setHeader("X-Saved-Percent", savedPercent);
    res.setHeader("X-Compression-Ratio", compressionRatio);
    res.setHeader("X-Output-Format", finalExt.replace(".", ""));

    if (req.user) {
      res.setHeader("X-Compression-Count", ((req.user.usage || 0) + 1).toString());
    } else {
      // Increment Guest Usage
      const { incrementGuestUsage, checkGuestLimit } = require("./userController");
      incrementGuestUsage(req.ip);
      const guestStats = checkGuestLimit(req.ip);
      res.setHeader("X-Compression-Count", guestStats.usage.toString());
    }

    // Determine Response Type: 
    // 1. If 'Accept: application/json'
    // 2. If 'Accept: text/html' (browser)
    // 3. If explicit ?json=true
    const wantsJson = (req.headers.accept && (req.headers.accept.includes("json") || req.headers.accept.includes("html"))) || req.query.json === 'true';

    const filename = path.basename(outputPath);
    const downloadUrl = `/api/compress/download/${filename}?name=${encodeURIComponent(downloadFilename)}`;

    if (wantsJson) {
      // Clean up inputPath ONLY, keep outputPath for downloadUrl
      cleanup([inputPath]);

      return res.status(201).json({
        success: true,
        input: { size: originalSize, type: req.file.mimetype },
        output: {
          size: compressedSize,
          type: contentTypeMap[finalExt.toLowerCase()] || 'image/jpeg',
          width: width,
          height: height,
          ratio: parseFloat((compressedSize / originalSize).toFixed(4)),
          url: downloadUrl,
          filename: downloadFilename
        },
        stats: {
          saved_percent: savedPercent,
          compression_count: req.user ? (req.user.usage || 0) + 1 : null
        }
      });
    }

    // Legacy Binary Response (for direct curl)
    res.setHeader("Content-Disposition", `attachment; filename="${downloadFilename}"`);
    res.setHeader("Content-Type", contentTypeMap[finalExt.toLowerCase()] || 'application/octet-stream');

    const fileStream = fs.createReadStream(outputPath);
    fileStream.pipe(res);

    fileStream.on('end', () => {
      // Delete BOTH after direct stream
      cleanup([inputPath, outputPath]);
    });

    fileStream.on('error', (err) => {
      cleanup([inputPath, outputPath]);
      if (!res.headersSent) {
        res.status(500).json({ success: false, error: "Failed to stream file" });
      }
    });

  } catch (err) {
    cleanup([inputPath, outputPath]);
    next(err);
  }
};

exports.downloadResult = async (req, res) => {
  const { filename } = req.params;
  const { name } = req.query;

  // Security: Prevent path traversal
  const safeFilename = path.basename(filename);
  const filePath = path.join(__dirname, "..", "output", safeFilename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, error: "File not found or expired" });
  }

  const ext = path.extname(filename).toLowerCase();
  const contentTypeMap = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.zip': 'application/zip'
  };

  if (name) {
    res.setHeader("Content-Disposition", `attachment; filename="${name}"`);
  }

  res.setHeader("Content-Type", contentTypeMap[ext] || 'application/octet-stream');
  res.sendFile(filePath);
};

exports.compressBatch = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, error: "No images uploaded" });
  }

  const results = [];
  const tempFiles = [];
  const compressedFiles = []; // Track compressed files for ZIP

  try {
    // Process all files
    for (const file of req.files) {
      tempFiles.push(file.path);

      // Validate file content for each file
      const contentValidation = await validateFileContent(file.path);
      if (!contentValidation.valid) {
        throw new Error(`Invalid file content for ${file.originalname}: ${contentValidation.error}`);
      }

      const originalExt = path.extname(file.originalname);
      const outputPath = path.join("output", `batch-${Date.now()}-${Math.round(Math.random() * 1E5)}-${file.filename}`);
      tempFiles.push(outputPath);

      await runCompression(file.path, outputPath, null);

      if (!fs.existsSync(outputPath)) {
        throw new Error(`Compression failed for ${file.originalname}`);
      }

      const compressedSize = fs.statSync(outputPath).size;
      const compressionRatio = ((file.size - compressedSize) / file.size * 100).toFixed(2);
      const savedPercent = compressionRatio;

      // Generate output filename (Sanitized)
      const safeOriginalName = path.basename(file.originalname);
      const nameWithoutExt = safeOriginalName.substring(0, safeOriginalName.lastIndexOf(".")) || safeOriginalName;
      const outputFilename = `${nameWithoutExt}-min${originalExt}`;

      results.push({
        filename: file.originalname,
        outputFilename: outputFilename,
        originalSize: file.size,
        compressedSize: compressedSize,
        compressionRatio: parseFloat(compressionRatio),
        savedPercent: parseFloat(savedPercent)
      });

      compressedFiles.push({
        path: outputPath,
        name: outputFilename
      });
    }

    // Set response headers for ZIP download
    res.setHeader("X-Total-Files", compressedFiles.length.toString());
    res.setHeader("X-Total-Original-Size", results.reduce((sum, r) => sum + r.originalSize, 0).toString());
    res.setHeader("X-Total-Compressed-Size", results.reduce((sum, r) => sum + r.compressedSize, 0).toString());
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="compressed-images.zip"`);
    res.setHeader("X-Total-Files", compressedFiles.length.toString());
    res.setHeader("X-Total-Original-Size", results.reduce((sum, r) => sum + r.originalSize, 0).toString());
    res.setHeader("X-Total-Compressed-Size", results.reduce((sum, r) => sum + r.compressedSize, 0).toString());

    // Create ZIP archive and stream directly to response
    const archive = archiver("zip", { zlib: { level: 9 } });

    // Handle archive errors
    archive.on("error", (err) => {
      cleanup(tempFiles);
      if (!res.headersSent) {
        res.status(500).json({ success: false, error: "Failed to create ZIP archive" });
      }
    });

    // Cleanup after ZIP is sent
    res.on("finish", () => {
      cleanup(tempFiles);
    });

    res.on("close", () => {
      cleanup(tempFiles);
      if (!archive.finalized) {
        archive.abort();
      }
    });

    // Pipe archive directly to response
    archive.pipe(res);

    // Add all compressed files to ZIP
    for (const file of compressedFiles) {
      archive.file(file.path, { name: file.name });
    }

    // Finalize the archive (this will trigger the response)
    await archive.finalize();

  } catch (err) {
    cleanup(tempFiles);
    console.error("Batch compression error:", err);
    // If headers already sent, we can't send JSON error
    if (!res.headersSent) {
      next(err);
    } else {
      console.error("Error after headers sent:", err);
      res.end();
    }
  }
};
