const path = require("path");
const fs = require("fs");
const { runCompression } = require("../services/engineService");

exports.compressImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  try {
    const inputPath = req.file.path;

    // Read desired output format (?format=webp|jpg|png)
    // Read desired output format (?format=webp|jpg|png)
    let outputFormat = req.query.format
      ? req.query.format.toLowerCase()
      : null;

    // Security: Validate format whitelist (Prevent Command Injection)
    const allowedFormats = ["jpg", "jpeg", "png", "webp"];
    if (outputFormat && !allowedFormats.includes(outputFormat)) {
      return res.status(400).json({ error: "Invalid format. Supported: jpg, png, webp" });
    }

    // Decide output extension
    let extension = path.extname(req.file.originalname);

    if (outputFormat) {
      extension = "." + outputFormat;
    }

    const outputFile = `compressed-${Date.now()}${extension}`;
    const outputPath = path.join("output", outputFile);

    // Stats before compression
    const originalSize = fs.statSync(inputPath).size;

    // Ensure output directory exists
    const outputDir = path.join(__dirname, "..", "output");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Copy input → output removed (engine handles this)
    // fs.copyFileSync(inputPath, outputPath);

    // Run engine on OUTPUT file
    await runCompression(inputPath, outputPath, outputFormat);


    if (!fs.existsSync(outputPath)) {
      throw new Error("Engine did not create output file");
    }
    // Stats after compression
    const compressedSize = fs.statSync(outputPath).size;
    const savedBytes = originalSize - compressedSize;
    const savedPercent = ((savedBytes / originalSize) * 100).toFixed(2);

    // TinyPNG-style headers
    res.setHeader("X-Original-Size", originalSize);
    res.setHeader("X-Compressed-Size", compressedSize);
    res.setHeader("X-Saved-Percent", savedPercent);

    // Download response
    res.download(outputPath, () => {
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });

  } catch (err) {
    console.error("Compression error:", err);
    res.status(500).json({
      error: "Compression failed",
      details: err.message
    });

    // Debug logging
    const logPath = path.join(__dirname, "..", "debug.log");
    const logMsg = `[${new Date().toISOString()}] Error: ${err.message}\nStack: ${err.stack}\n\n`;
    fs.appendFileSync(logPath, logMsg);
  }
};
