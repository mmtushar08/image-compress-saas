const db = require('../services/db');

/**
 * Get total available credits (base + add-ons)
 */
const getTotalCredits = (apiKey) => {
    const baseLimit = apiKey.monthly_limit || 0;
    const addonCredits = apiKey.addon_credits || 0;
    return baseLimit + addonCredits;
};

/**
 * Get add-on purchase history
 */
const getAddonHistory = (apiKeyId) => {
    const apiKey = db.prepare('SELECT addon_history FROM api_keys WHERE id = ?').get(apiKeyId);

    if (!apiKey) {
        return [];
    }

    return JSON.parse(apiKey.addon_history || '[]');
};

module.exports = {
    getTotalCredits,
    getAddonHistory,
};
