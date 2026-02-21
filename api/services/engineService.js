const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const { withConcurrencyLimit } = require("../utils/concurrencyLimiter");

// Cap Sharp's internal libvips thread pool to 1 thread per job.
// This prevents a single compression from grabbing all CPU cores.
// Multiple jobs still run (up to MAX_CONCURRENT), providing throughput.
sharp.concurrency(1);

exports.runCompression = async (input, output, format, quality, method, width, height, preserve) => {
  return withConcurrencyLimit(() => _compress(input, output, format, quality, method, width, height, preserve));
};

async function _compress(input, output, format, quality, method, width, height, preserve) {
  try {
    // Get input file size for comparison
    const inputSize = fs.statSync(input).size;

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

    // Smart Quality Selection
    // For small files (already optimized), use higher quality to avoid size increase
    // For large files, use more aggressive compression
    let q = quality ? parseInt(quality) : null;

    if (!q) {
      // Adaptive quality based on file size (CPU-friendly settings)
      if (inputSize < 50 * 1024) {
        // Small files (< 50KB) - likely already optimized
        q = 90; // High quality to avoid re-encoding bloat
      } else if (inputSize < 500 * 1024) {
        // Medium files (50KB - 500KB)
        q = 82;
      } else if (inputSize < 2 * 1024 * 1024) {
        // Large files (500KB - 2MB)
        q = 78; // Reduced from 75 to balance quality and CPU usage
      } else {
        // Very large files (> 2MB) - reduce CPU load significantly
        q = 75; // Conservative compression to prevent CPU overload
      }
    }

    // Apply format-specific options
    if (targetFormat === 'jpeg') {
      pipeline.jpeg({ quality: q, mozjpeg: true });
    } else if (targetFormat === 'png') {
      pipeline.png({ quality: q, compressionLevel: 6 }); // level 9 = max CPU; 6 = good balance
    } else if (targetFormat === 'webp') {
      pipeline.webp({ quality: q, effort: 4 }); // effort 4 = balanced compression/speed for production
    } else if (targetFormat === 'avif') {
      pipeline.avif({ quality: q, effort: 3 }); // effort 3 = good quality, much less CPU than 4
    } else {
      // Fallback for others or if format detection failed
      // (Sharp infers from toFile extension if not explicit)
    }

    // 3. Metadata Preservation (TinyPNG-compatible)
    // TinyPNG supports: copyright, creation, location
    // Sharp's withMetadata() preserves: exif, icc, xmp
    if (preserve) {
      // If preserve is a boolean true or string 'true', keep all metadata
      if (preserve === true || preserve === 'true') {
        pipeline.withMetadata();
      }
      // If preserve is an array (TinyPNG format: ["copyright", "creation", "location"])
      else if (Array.isArray(preserve)) {
        // Sharp doesn't support selective metadata preservation
        // So we preserve all if any option is requested
        if (preserve.length > 0) {
          pipeline.withMetadata();
        }
      }
      // If preserve is a string like "copyright,creation"
      else if (typeof preserve === 'string' && preserve !== 'false') {
        pipeline.withMetadata();
      }
    }

    // 4. Output
    await pipeline.toFile(output);

    // 5. Smart Size Check - Return original if compressed is larger
    const outputSize = fs.statSync(output).size;

    // If output is larger than input (compression made it worse)
    if (outputSize >= inputSize && !width && !height && !format) {
      // Only return original if we're not resizing or converting format
      // Copy original to output location
      fs.copyFileSync(input, output);
      console.log(`⚠️ Compression increased size (${inputSize} -> ${outputSize}). Returning original.`);
    }

    return "Compression successful";

  } catch (error) {
    throw new Error(`Compression failed: ${error.message}`);
  }
};
