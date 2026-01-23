const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const adminController = require('../controllers/adminController');

// All routes require admin authentication
router.use(adminAuth);

// System statistics
router.get('/stats', adminController.getStats);

// User management
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserDetails);
router.put('/users/:id/plan', adminController.updateUserPlan);

module.exports = router;
