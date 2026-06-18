// Mock the repository + logger so planService logic is tested in isolation
jest.mock('../../repositories/userRepository', () => ({
    findByEmail:   jest.fn(),
    updateByEmail: jest.fn(),
}));
jest.mock('../../utils/logger', () => ({
    info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn(),
}));

const userRepo = require('../../repositories/userRepository');
const { PLANS, upgradeUserPlan } = require('../planService');

describe('PLANS constant', () => {
    it('free plan has 20 webLimit and 500 apiCredits', () => {
        expect(PLANS.free.webLimit).toBe(20);
        expect(PLANS.free.apiCredits).toBe(500);
        expect(PLANS.free.price).toBe(0);
    });

    it('web-pro has unlimited (-1) webLimit', () => {
        expect(PLANS['web-pro'].webLimit).toBe(-1);
    });

    it('api-ultra has the highest apiCredits', () => {
        expect(PLANS['api-ultra'].apiCredits).toBe(15000);
    });

    it('all subscription plans have a maxFileSize', () => {
        ['free', 'web-pro', 'web-ultra', 'api-pro', 'api-ultra'].forEach(p => {
            expect(PLANS[p].maxFileSize).toBeGreaterThan(0);
        });
    });
});

describe('upgradeUserPlan()', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        userRepo.updateByEmail.mockResolvedValue(1);
    });

    it('returns null when user is not found', async () => {
        userRepo.findByEmail.mockResolvedValue(null);
        await expect(upgradeUserPlan('ghost@x.com', 'web-pro', 'pay_1')).resolves.toBeNull();
    });

    it('upgrades to web-pro and resets usage', async () => {
        userRepo.findByEmail.mockResolvedValue({ id: 'u1', email: 'a@b.com', plan: 'free', credits: 0 });

        const result = await upgradeUserPlan('a@b.com', 'web-pro', 'pay_2');

        expect(result).not.toBeNull();
        expect(result.plan).toBe('web-pro');
        expect(result.usage).toBe(0);
        expect(userRepo.updateByEmail).toHaveBeenCalledWith('a@b.com', expect.objectContaining({ plan: 'web-pro', usage: 0 }));
    });

    it('normalises legacy "pro" alias to "web-pro"', async () => {
        userRepo.findByEmail.mockResolvedValue({ id: 'u2', email: 'c@d.com', plan: 'free', credits: 0 });
        const result = await upgradeUserPlan('c@d.com', 'pro', 'pay_3');
        expect(result.plan).toBe('web-pro');
    });

    it('normalises legacy "ultra" alias to "web-ultra"', async () => {
        userRepo.findByEmail.mockResolvedValue({ id: 'u3', email: 'e@f.com', plan: 'free', credits: 0 });
        const result = await upgradeUserPlan('e@f.com', 'ultra', 'pay_4');
        expect(result.plan).toBe('web-ultra');
    });

    it('adds credits for a credit bundle purchase', async () => {
        userRepo.findByEmail.mockResolvedValue({ id: 'u4', email: 'g@h.com', plan: 'free', credits: 300 });
        const result = await upgradeUserPlan('g@h.com', 'credit-1.5k', 'pay_5');
        expect(result.credits).toBe(1800); // 300 + 1500
        expect(userRepo.updateByEmail).toHaveBeenCalledWith('g@h.com', expect.objectContaining({ credits: 1800 }));
    });

    it('returns null for an unrecognised plan name', async () => {
        userRepo.findByEmail.mockResolvedValue({ id: 'u5', email: 'i@j.com', plan: 'free', credits: 0 });
        await expect(upgradeUserPlan('i@j.com', 'enterprise-mega', 'pay_6')).resolves.toBeNull();
    });
});
