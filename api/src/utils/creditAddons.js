const db = require('../services/db');
const logger = require('./logger');

/**
 * Credit Add-On Manager
 * Handles credit boost purchases and tracking
 * 
 * Rules:
 * - Credits apply to current billing cycle only
 * - No rollover to next cycle
 * - API-only (not web)
 * - Respect plan file-size limits
 * - Soft cap for anti-abuse
 */

// Credit add-on packages
const CREDIT_ADDONS = {
    'small-boost': {
        name: 'Small Boost',
        credits: 1000,
        price: 8.00,
        description: '+1,000 images for current cycle'
    },
    'growth-boost': {
        name: 'Growth Boost',
        credits: 5000,
        price: 35.00,
        description: '+5,000 images for current cycle'
    },
    'scale-boost': {
        name: 'Scale Boost',
        credits: 10000,
        price: 85.00,
        description: '+10,000 images for current cycle'
    }
};

// Soft cap: max total credits per cycle (anti-abuse)
const MAX_ADDON_CREDITS_PER_CYCLE = 50000;

/**
 * Purchase credit add-on
 */
const purchaseAddon = (apiKeyId, addonType, paymentId, requestId) => {
    const addon = CREDIT_ADDONS[addonType];

    if (!addon) {
        throw new Error(`Invalid add-on type: ${addonType}`);
    }

    // Get current API key
    const apiKey = db.prepare('SELECT * FROM api_keys WHERE id = ?').get(apiKeyId);

    if (!apiKey) {
        throw new Error('API key not found');
    }

    // Check soft cap
    const currentAddonCredits = apiKey.addon_credits || 0;
    if (currentAddonCredits + addon.credits > MAX_ADDON_CREDITS_PER_CYCLE) {
        throw new Error(`Add-on would exceed maximum of ${MAX_ADDON_CREDITS_PER_CYCLE} credits per cycle`);
    }

    // Add credits
    const newAddonCredits = currentAddonCredits + addon.credits;

    // Update history
    const history = JSON.parse(apiKey.addon_history || '[]');
    history.push({
        addon: addonType,
        credits: addon.credits,
        price: addon.price,
        purchased_at: new Date().toISOString(),
        payment_id: paymentId,
        cycle_start: apiKey.billing_cycle_start
    });

    // Update database
    db.prepare(`
        UPDATE api_keys 
        SET addon_credits = ?,
            addon_history = ?
        WHERE id = ?
    `).run(newAddonCredits, JSON.stringify(history), apiKeyId);

    logger.info('Credit add-on purchased', {
        api_key_id: apiKeyId,
        addon: addonType,
        credits: addon.credits,
        total_addon_credits: newAddonCredits,
        request_id: requestId
    });

    return {
        success: true,
        addon: addon.name,
        credits_added: addon.credits,
        total_addon_credits: newAddonCredits,
        total_available: apiKey.monthly_limit + newAddonCredits
    };
};

/**
 * Get total available credits (base + add-ons)
 */
const getTotalCredits = (apiKey) => {
    const baseLimit = apiKey.monthly_limit || 0;
    const addonCredits = apiKey.addon_credits || 0;
    return baseLimit + addonCredits;
};

/**
 * Reset add-on credits at cycle end
 */
const resetAddonCredits = (apiKeyId) => {
    db.prepare(`
        UPDATE api_keys 
        SET addon_credits = 0
        WHERE id = ?
    `).run(apiKeyId);

    logger.info('Reset add-on credits for new cycle', {
        api_key_id: apiKeyId
    });
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

/**
 * Get available add-ons for a plan
 */
const getAvailableAddons = (planId) => {
    // Add-ons only available for API plans
    const apiPlans = ['api-pro', 'api-ultra', 'business', 'pro', 'starter'];

    if (!apiPlans.includes(planId)) {
        return [];
    }

    return Object.keys(CREDIT_ADDONS).map(key => ({
        id: key,
        ...CREDIT_ADDONS[key]
    }));
};

module.exports = {
    CREDIT_ADDONS,
    MAX_ADDON_CREDITS_PER_CYCLE,
    purchaseAddon,
    getTotalCredits,
    resetAddonCredits,
    getAddonHistory,
    getAvailableAddons
};
