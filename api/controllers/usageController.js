const db = require('../services/db');
const { PLAN_LIMITS } = require('../utils/quotaManager');
const { getAddonHistory, getTotalCredits } = require('../utils/creditAddons');
const { checkAndResetCycle } = require('../utils/quotaManager');

/**
 * Get user's quota and usage data for dashboard
 */
exports.getUsageStats = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get user's API key(s)
        const apiKeys = db.prepare('SELECT * FROM api_keys WHERE user_id = ? AND is_active = 1').all(userId);

        if (!apiKeys || apiKeys.length === 0) {
            return res.json({
                success: true,
                has_api_key: false,
                message: 'No API key found. Generate one to start using the API.'
            });
        }

        // Use primary API key (first one)
        let apiKey = apiKeys[0];

        // Reset cycle if needed
        apiKey = checkAndResetCycle(apiKey);

        // Get plan limits
        const planLimits = PLAN_LIMITS[apiKey.plan_id] || PLAN_LIMITS.free;

        // Calculate totals
        const baseLimit = apiKey.monthly_limit || planLimits.monthly_limit;
        const addonCredits = apiKey.addon_credits || 0;
        const totalLimit = baseLimit + addonCredits;
        const used = apiKey.used_count || 0;
        const remaining = Math.max(0, totalLimit - used);
        const percentageUsed = totalLimit > 0 ? ((used / totalLimit) * 100).toFixed(1) : 0;

        // Get add-on history
        const addonHistory = getAddonHistory(apiKey.id);

        // Calculate days until reset
        const resetDate = new Date(apiKey.reset_at);
        const now = new Date();
        const daysUntilReset = Math.ceil((resetDate - now) / (1000 * 60 * 60 * 24));

        // Response data
        const usageData = {
            success: true,
            has_api_key: true,

            // Current usage
            usage: {
                used: used,
                remaining: remaining,
                total: totalLimit,
                percentage: parseFloat(percentageUsed)
            },

            // Plan details
            plan: {
                id: apiKey.plan_id,
                name: apiKey.plan_id.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                base_limit: baseLimit,
                max_file_size: planLimits.max_file_size,
                max_file_size_mb: (planLimits.max_file_size / 1024 / 1024).toFixed(0),
                max_pixels: planLimits.maxPixels,
                allowed_formats: planLimits.allowed_formats,
                features: planLimits.features,
                rate_limit: planLimits.rate_limit
            },

            // Add-on credits
            addons: {
                current_credits: addonCredits,
                purchase_history: addonHistory.map(addon => ({
                    type: addon.addon,
                    credits: addon.credits,
                    price: addon.price,
                    purchased_at: addon.purchased_at,
                    payment_id: addon.payment_id
                }))
            },

            // Billing cycle
            cycle: {
                reset_at: apiKey.reset_at,
                days_until_reset: daysUntilReset,
                billing_cycle_start: apiKey.billing_cycle_start
            },

            // API key info (masked)
            api_key: {
                id: apiKey.id,
                key_preview: `${apiKey.key.substring(0, 10)}...${apiKey.key.substring(apiKey.key.length - 4)}`,
                is_sandbox: apiKey.is_sandbox === 1,
                created_at: apiKey.created_at,
                last_used_at: apiKey.last_used_at
            }
        };

        res.json(usageData);

    } catch (error) {
        console.error('Error fetching usage stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch usage statistics'
        });
    }
};
