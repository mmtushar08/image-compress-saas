const db = require('../services/db');
const { PLANS } = require('./userController');

/**
 * Get system-wide statistics
 */
exports.getStats = (req, res) => {
    try {
        // Total users
        const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;

        // Users by plan
        const planBreakdown = db.prepare(`
            SELECT plan, COUNT(*) as count 
            FROM users 
            GROUP BY plan
        `).all();

        // Total compressions (sum of all usage)
        const totalCompressions = db.prepare('SELECT SUM(usage) as total FROM users').get().total || 0;

        // Active users (used in last 30 days)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        const activeUsers = db.prepare(`
            SELECT COUNT(*) as count 
            FROM users 
            WHERE lastUsedDate > ?
        `).get(thirtyDaysAgo).count;

        // Recent signups (last 7 days)
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const recentSignups = db.prepare(`
            SELECT COUNT(*) as count 
            FROM users 
            WHERE createdAt > ?
        `).get(sevenDaysAgo).count;

        res.json({
            success: true,
            stats: {
                totalUsers,
                activeUsers,
                recentSignups,
                totalCompressions,
                planBreakdown
            }
        });
    } catch (error) {
        console.error('Admin getStats error:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
};

/**
 * Get all users with pagination and filtering
 */
exports.getAllUsers = (req, res) => {
    try {
        const { page = 1, limit = 50, search = '', plan = '' } = req.query;
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM users WHERE 1=1';
        const params = [];

        // Search by email
        if (search) {
            query += ' AND email LIKE ?';
            params.push(`%${search}%`);
        }

        // Filter by plan
        if (plan) {
            query += ' AND plan = ?';
            params.push(plan);
        }

        // Order by most recent first
        query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const users = db.prepare(query).all(...params);

        // Get total count for pagination
        let countQuery = 'SELECT COUNT(*) as count FROM users WHERE 1=1';
        const countParams = [];
        if (search) {
            countQuery += ' AND email LIKE ?';
            countParams.push(`%${search}%`);
        }
        if (plan) {
            countQuery += ' AND plan = ?';
            countParams.push(plan);
        }
        const totalCount = db.prepare(countQuery).get(...countParams).count;

        // Parse invoice details for each user
        const parsedUsers = users.map(user => ({
            ...user,
            invoiceDetails: user.invoiceDetails ? JSON.parse(user.invoiceDetails) : {},
            webLimit: Number(user.webLimit),
            apiCredits: Number(user.apiCredits),
            usage: Number(user.usage),
            dailyUsage: Number(user.dailyUsage),
            credits: Number(user.credits)
        }));

        res.json({
            success: true,
            users: parsedUsers,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: totalCount,
                totalPages: Math.ceil(totalCount / limit)
            }
        });
    } catch (error) {
        console.error('Admin getAllUsers error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

/**
 * Get detailed information for a specific user
 */
exports.getUserDetails = (req, res) => {
    try {
        const { id } = req.params;
        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const parsedUser = {
            ...user,
            invoiceDetails: user.invoiceDetails ? JSON.parse(user.invoiceDetails) : {},
            webLimit: Number(user.webLimit),
            apiCredits: Number(user.apiCredits),
            usage: Number(user.usage),
            dailyUsage: Number(user.dailyUsage),
            credits: Number(user.credits)
        };

        res.json({
            success: true,
            user: parsedUser
        });
    } catch (error) {
        console.error('Admin getUserDetails error:', error);
        res.status(500).json({ error: 'Failed to fetch user details' });
    }
};

/**
 * Update user's plan (admin override)
 */
exports.updateUserPlan = (req, res) => {
    try {
        const { id } = req.params;
        const { plan } = req.body;

        if (!PLANS[plan]) {
            return res.status(400).json({ error: 'Invalid plan' });
        }

        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const planConfig = PLANS[plan];
        const planUpdatedAt = new Date().toISOString();

        db.prepare(`
            UPDATE users 
            SET plan = ?, 
                webLimit = ?, 
                apiCredits = ?, 
                planUpdatedAt = ? 
            WHERE id = ?
        `).run(
            plan,
            planConfig.webLimit || 20,
            planConfig.apiCredits || 0,
            planUpdatedAt,
            id
        );

        const updatedUser = db.prepare('SELECT * FROM users WHERE id = ?').get(id);

        res.json({
            success: true,
            message: `User plan updated to ${plan}`,
            user: {
                ...updatedUser,
                invoiceDetails: updatedUser.invoiceDetails ? JSON.parse(updatedUser.invoiceDetails) : {}
            }
        });
    } catch (error) {
        console.error('Admin updateUserPlan error:', error);
        res.status(500).json({ error: 'Failed to update user plan' });
    }
};
