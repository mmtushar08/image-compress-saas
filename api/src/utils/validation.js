const { body, validationResult } = require('express-validator');

// Email validation
const emailValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email too long')
];

// Plan validation
const planValidation = [
  body('plan')
    .optional()
    .isIn(['free', 'pro', 'business', 'ultra', 'web-pro', 'web-ultra'])
    .withMessage('Invalid plan type')
];

// Validation result handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// Sanitize string input
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .replace(/[<>\"']/g, '') // Remove potentially dangerous characters
    .substring(0, 255); // Limit length
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
};

module.exports = {
  emailValidation,
  planValidation,
  handleValidationErrors,
  sanitizeString,
  isValidEmail
};

