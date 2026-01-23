const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const csrf = require('csurf');
const { body, validationResult } = require('express-validator');
const { register, getProfile, verifyToken, logout } = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const { emailValidation, planValidation, handleValidationErrors } = require('../utils/validation');

// CSRF Protection
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }
});

// Rate limiter for token verification (prevent brute force)
const tokenVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per IP
  message: {
    success: false,
    error: 'Too many verification attempts. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation middleware for token verification
const tokenValidation = [
  body('token')
    .isLength({ min: 64 })
    .withMessage('Invalid token format'),
  body('email')
    .isEmail()
    .withMessage('Invalid email format'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

// Register with validation and CSRF protection
router.post('/register',
  csrfProtection,
  emailValidation,
  planValidation,
  handleValidationErrors,
  register
);

// Verify magic link token - CHANGED TO POST for security with CSRF
router.post('/verify-token',
  csrfProtection,
  tokenVerifyLimiter,
  tokenValidation,
  verifyToken
);

// Keep GET for backward compatibility (temporary - will be removed)
router.get('/verify-token', (req, res) => {
  res.status(405).json({
    success: false,
    error: 'Method not allowed',
    message: 'Please use POST method for token verification',
    migration: 'Update your client to send POST requests to /api/users/verify-token'
  });
});

router.get('/profile', authMiddleware, getProfile);

// Logout - Clear session cookie with CSRF protection
router.post('/logout', csrfProtection, logout);

module.exports = router;
