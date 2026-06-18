const logger = require('../utils/logger');
const userRepo = require('../repositories/userRepository');

const PLANS = {
    free:           { name: 'Free',           price: 0,  webLimit: 20, apiCredits: 500,   maxFileSize: 5   * 1024 * 1024, credits: 0 },
    'web-pro':      { name: 'Web Pro',         price: 39, webLimit: -1, apiCredits: 500,   maxFileSize: 75  * 1024 * 1024, credits: 0 },
    'web-ultra':    { name: 'Web Ultra',       price: 59, webLimit: -1, apiCredits: 500,   maxFileSize: 150 * 1024 * 1024, credits: 0 },
    'api-pro':      { name: 'API Pro',         price: 35, webLimit: 20, apiCredits: 5000,  maxFileSize: 25  * 1024 * 1024, credits: 0 },
    'api-ultra':    { name: 'API Ultra',       price: 90, webLimit: 20, apiCredits: 15000, maxFileSize: 50  * 1024 * 1024, credits: 0 },
    'credit-1.5k':  { name: '1,500 Credits',  price: 14, credits: 1500, type: 'credit' },
    'credit-3.5k':  { name: '3,500 Credits',  price: 28, credits: 3500, type: 'credit' },
    'credit-6.5k':  { name: '6,500 Credits',  price: 56, credits: 6500, type: 'credit' },
};

const upgradeUserPlan = async (email, planName, paymentId) => {
    const row = await userRepo.findByEmail(email);
    if (!row) return null;

    // Normalize legacy plan aliases
    let targetPlan = planName;
    if (planName === 'pro')   targetPlan = 'web-pro';
    if (planName === 'ultra') targetPlan = 'web-ultra';

    // Credit bundle purchase
    if (targetPlan.startsWith('credit-')) {
        const bundle = PLANS[targetPlan];
        if (!bundle) {
            logger.error('Invalid credit bundle requested', { planName, email });
            return null;
        }
        const newCredits = (Number(row.credits) || 0) + bundle.credits;
        logger.info('Adding credits to user', { email, added: bundle.credits, newBalance: newCredits });
        await userRepo.updateByEmail(email, { credits: newCredits, lastPaymentId: paymentId });
        return { ...row, credits: newCredits };
    }

    if (!PLANS[targetPlan]) {
        logger.error('Invalid plan requested', { planName, email });
        return null;
    }

    const planConfig = PLANS[targetPlan];
    const planUpdatedAt = new Date().toISOString();

    logger.info('Upgrading user plan', { email, from: row.plan, to: targetPlan });

    await userRepo.updateByEmail(email, {
        plan: targetPlan,
        lastPaymentId: paymentId,
        planUpdatedAt,
        webLimit: planConfig.webLimit || 20,
        apiCredits: planConfig.apiCredits || 0,
        usage: 0,
    });

    return {
        ...row,
        plan: targetPlan,
        webLimit: planConfig.webLimit || 20,
        apiCredits: planConfig.apiCredits || 0,
        usage: 0,
    };
};

module.exports = { PLANS, upgradeUserPlan };
