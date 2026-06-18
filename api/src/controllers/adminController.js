const logger = require('../utils/logger');
const { PLANS } = require('./userController');
const userRepo = require('../repositories/userRepository');
const auditRepo = require('../repositories/auditRepository');
const { audit } = require('../services/auditService');

const parseUser = (user) => ({
    ...user,
    invoiceDetails: user.invoiceDetails ? JSON.parse(user.invoiceDetails) : {},
    webLimit:   Number(user.webLimit),
    apiCredits: Number(user.apiCredits),
    usage:      Number(user.usage),
    dailyUsage: Number(user.dailyUsage),
    credits:    Number(user.credits),
});

/**
 * Get system-wide statistics
 */
exports.getStats = async (req, res) => {
    try {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        const sevenDaysAgo  = new Date(Date.now() - 7  * 24 * 60 * 60 * 1000).toISOString();

        const [totalUsers, planBreakdown, totalCompressions, activeUsers, recentSignups] =
            await Promise.all([
                userRepo.countAll(),
                userRepo.planBreakdown(),
                userRepo.totalCompressions(),
                userRepo.countActiveSince(thirtyDaysAgo),
                userRepo.countCreatedSince(sevenDaysAgo),
            ]);

        res.json({
            success: true,
            stats: {
                totalUsers,
                activeUsers,
                recentSignups,
                totalCompressions,
                planBreakdown: planBreakdown.map(p => ({ plan: p.plan, count: Number(p.count) })),
            },
        });
    } catch (error) {
        logger.error('Admin getStats error', { error: error.message });
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
};

/**
 * Get all users with pagination and filtering
 */
exports.getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 50, search = '', plan = '' } = req.query;
        const pageNum  = parseInt(page);
        const limitNum = parseInt(limit);
        const offset   = (pageNum - 1) * limitNum;

        const { users, total } = await userRepo.listUsers({ search, plan, limit: limitNum, offset });

        res.json({
            success: true,
            users: users.map(parseUser),
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum),
            },
        });
    } catch (error) {
        logger.error('Admin getAllUsers error', { error: error.message });
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

/**
 * Get detailed information for a specific user
 */
exports.getUserDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userRepo.findById(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ success: true, user: parseUser(user) });
    } catch (error) {
        logger.error('Admin getUserDetails error', { error: error.message });
        res.status(500).json({ error: 'Failed to fetch user details' });
    }
};

/**
 * Update user's plan (admin override)
 */
exports.updateUserPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const { plan } = req.body;

        if (!PLANS[plan]) {
            return res.status(400).json({ error: 'Invalid plan' });
        }

        const user = await userRepo.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const planConfig = PLANS[plan];
        await userRepo.updateById(id, {
            plan,
            webLimit:   planConfig.webLimit || 20,
            apiCredits: planConfig.apiCredits || 0,
            planUpdatedAt: new Date().toISOString(),
        });

        const updatedUser = await userRepo.findById(id);

        audit('admin.plan_update', {
            actorType: 'admin', targetType: 'user', targetId: id, ip: req.ip,
            metadata: { from: user.plan, to: plan },
        });

        res.json({
            success: true,
            message: `User plan updated to ${plan}`,
            user: parseUser(updatedUser),
        });
    } catch (error) {
        logger.error('Admin updateUserPlan error', { error: error.message });
        res.status(500).json({ error: 'Failed to update user plan' });
    }
};

/**
 * Read the audit log (most recent first), optionally filtered by action.
 */
exports.getAuditLog = async (req, res) => {
    try {
        const { action = '', actorId = '', page = 1, limit = 100 } = req.query;
        const limitNum = Math.min(parseInt(limit) || 100, 500);
        const offset   = ((parseInt(page) || 1) - 1) * limitNum;

        const entries = await auditRepo.list({ action, actorId, limit: limitNum, offset });
        res.json({
            success: true,
            entries: entries.map(e => ({ ...e, metadata: e.metadata ? JSON.parse(e.metadata) : null })),
        });
    } catch (error) {
        logger.error('Admin getAuditLog error', { error: error.message });
        res.status(500).json({ error: 'Failed to fetch audit log' });
    }
};
