const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getUsageStats } = require('../controllers/usageController');

/**
 * @route   GET /api/usage/stats
 * @desc    Get user's quota and usage statistics for dashboard
 * @access  Private (requires authentication)
 */
router.get('/stats', authMiddleware, getUsageStats);

module.exports = router;
