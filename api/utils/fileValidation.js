const fs = require('fs');
const path = require('path');
const sanitize = require('sanitize-filename');

// Allowed MIME types
const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp'
];

// Allowed file extensions
const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp'];

// Magic bytes for image formats
const MAGIC_BYTES = {
  png: Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
  jpeg: Buffer.from([0xFF, 0xD8, 0xFF]),
  webp: Buffer.from([0x52, 0x49, 0x46, 0x46]) // RIFF header
};

/**
 * Validate file by checking magic bytes
 */
async function validateFileContent(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    return validateByMagicBytes(buffer);
  } catch (error) {
    return { valid: false, error: 'Failed to read file for validation' };
  }
}

/**
 * Validate by checking magic bytes (fallback)
 */
function validateByMagicBytes(buffer) {
  if (buffer.length < 8) {
    return { valid: false, error: 'File too small' };
  }

  // Check PNG
  if (buffer.slice(0, 8).equals(MAGIC_BYTES.png)) {
    return { valid: true, mime: 'image/png' };
  }

  // Check JPEG
  if (buffer.slice(0, 3).equals(MAGIC_BYTES.jpeg)) {
    return { valid: true, mime: 'image/jpeg' };
  }

  // Check WebP (RIFF...WEBP)
  if (buffer.slice(0, 4).equals(MAGIC_BYTES.webp) &&
    buffer.slice(8, 12).toString() === 'WEBP') {
    return { valid: true, mime: 'image/webp' };
  }

  return { valid: false, error: 'File does not appear to be a valid image' };
}

/**
 * Sanitize filename
 */
function sanitizeFilename(filename) {
  if (!filename || typeof filename !== 'string') {
    return `file-${Date.now()}`;
  }

  // Get extension
  const ext = path.extname(filename).toLowerCase();

  // Validate extension
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    throw new Error('Invalid file extension');
  }

  // Sanitize base name
  const baseName = path.basename(filename, ext);
  const sanitized = sanitize(baseName) || 'file';

  // Limit length
  const maxLength = 100;
  const truncated = sanitized.length > maxLength
    ? sanitized.substring(0, maxLength)
    : sanitized;

  return `${truncated}${ext}`;
}

/**
 * Validate file size
 */
function validateFileSize(size, maxSize = 50 * 1024 * 1024) {
  if (size > maxSize) {
    return { valid: false, error: `File size exceeds maximum of ${maxSize / 1024 / 1024}MB` };
  }
  if (size === 0) {
    return { valid: false, error: 'File is empty' };
  }
  return { valid: true };
}

module.exports = {
  validateFileContent,
  validateByMagicBytes,
  sanitizeFilename,
  validateFileSize,
  ALLOWED_MIME_TYPES,
  ALLOWED_EXTENSIONS
};

