const express = require('express');
const router = express.Router();
const { param, body, query } = require('express-validator');
const adminAuth = require('../middleware/adminAuth');
const { handleValidationErrors } = require('../utils/validation');
const adminController = require('../controllers/adminController');

// All routes require admin authentication
router.use(adminAuth);

// System statistics
router.get('/stats', adminController.getStats);

// User management
router.get('/users',
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 200 }),
    query('search').optional().isString().isLength({ max: 255 }),
    query('plan').optional().isString().isLength({ max: 50 }),
    handleValidationErrors,
    adminController.getAllUsers,
);

router.get('/users/:id',
    param('id').isString().isLength({ min: 1, max: 64 }),
    handleValidationErrors,
    adminController.getUserDetails,
);

router.put('/users/:id/plan',
    param('id').isString().isLength({ min: 1, max: 64 }),
    body('plan').isString().isLength({ min: 1, max: 50 }),
    handleValidationErrors,
    adminController.updateUserPlan,
);

// Audit log
router.get('/audit',
    query('action').optional().isString().isLength({ max: 64 }),
    query('actorId').optional().isString().isLength({ max: 64 }),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 500 }),
    handleValidationErrors,
    adminController.getAuditLog,
);

module.exports = router;
