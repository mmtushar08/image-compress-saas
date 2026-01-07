const express = require('express');
const router = express.Router();
const { register, getProfile, verifyToken } = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const { emailValidation, planValidation, handleValidationErrors } = require('../utils/validation');

// Register with validation
router.post('/register',
  emailValidation,
  planValidation,
  handleValidationErrors,
  register
);

// Verify magic link token
router.get('/verify-token', verifyToken);

router.get('/profile', authMiddleware, getProfile);

module.exports = router;
