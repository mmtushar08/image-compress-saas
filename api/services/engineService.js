const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

exports.runCompression = async (input, output, format, quality, method, width, height, preserve) => {
  try {
    const pipeline = sharp(input);

    // 1. Resize
    if (width || height) {
      // Parse integers if they are strings
      const w = width ? parseInt(width) : null;
      const h = height ? parseInt(height) : null;

      // Method mapping: 'fit' -> { fit: 'inside' }, 'fill' -> { fit: 'cover' }
      // Default to 'inside' to preserve aspect ratio within box, unless otherwise specified
      const options = {
        fit: method === 'fill' ? 'cover' : 'inside',
        withoutEnlargement: true
      };

      pipeline.resize(w, h, options);
    }

    // 2. Format & Quality
    // Map 'jpg' -> 'jpeg' for sharp
    let targetFormat = format ? format.toLowerCase() : path.extname(output).replace('.', '').toLowerCase();
    if (targetFormat === 'jpg') targetFormat = 'jpeg';

    // Normalize quality
    const q = quality ? parseInt(quality) : 80;

    // Apply format-specific options
    if (targetFormat === 'jpeg') {
      pipeline.jpeg({ quality: q, mozjpeg: true });
    } else if (targetFormat === 'png') {
      pipeline.png({ quality: q, compressionLevel: 9 });
    } else if (targetFormat === 'webp') {
      pipeline.webp({ quality: q });
    } else {
      // Fallback for others or if format detection failed
      // (Sharp infers from toFile extension if not explicit)
    }

    // 3. Metadata
    if (preserve === 'true' || preserve === true) {
      pipeline.keepMetadata();
    }

    // 4. Output
    await pipeline.toFile(output);

    return "Compression successful";

  } catch (error) {
    throw new Error(`Compression failed: ${error.message}`);
  }
};
