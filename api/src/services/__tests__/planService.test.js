// Mock db before any require so planService never touches the real DB
jest.mock('../db', () => ({ prepare: jest.fn() }));
jest.mock('../../utils/logger', () => ({
    info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn(),
}));

const { PLANS, upgradeUserPlan } = require('../planService');
const db = require('../db');

const makeStmt = (overrides = {}) => ({
    get: jest.fn(),
    run: jest.fn(),
    all: jest.fn(),
    ...overrides,
});

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
    beforeEach(() => jest.clearAllMocks());

    it('returns null when user is not found', () => {
        db.prepare.mockReturnValue(makeStmt({ get: jest.fn().mockReturnValue(null) }));
        expect(upgradeUserPlan('ghost@x.com', 'web-pro', 'pay_1')).toBeNull();
    });

    it('upgrades to web-pro and resets usage', () => {
        const user = { id: 'u1', email: 'a@b.com', plan: 'free', credits: 0 };
        const run  = jest.fn();
        db.prepare.mockReturnValue(makeStmt({ get: jest.fn().mockReturnValue(user), run }));

        const result = upgradeUserPlan('a@b.com', 'web-pro', 'pay_2');

        expect(result).not.toBeNull();
        expect(result.plan).toBe('web-pro');
        expect(result.usage).toBe(0);
        expect(run).toHaveBeenCalled();
    });

    it('normalises legacy "pro" alias to "web-pro"', () => {
        const user = { id: 'u2', email: 'c@d.com', plan: 'free', credits: 0 };
        db.prepare.mockReturnValue(makeStmt({ get: jest.fn().mockReturnValue(user), run: jest.fn() }));

        const result = upgradeUserPlan('c@d.com', 'pro', 'pay_3');
        expect(result.plan).toBe('web-pro');
    });

    it('normalises legacy "ultra" alias to "web-ultra"', () => {
        const user = { id: 'u3', email: 'e@f.com', plan: 'free', credits: 0 };
        db.prepare.mockReturnValue(makeStmt({ get: jest.fn().mockReturnValue(user), run: jest.fn() }));

        const result = upgradeUserPlan('e@f.com', 'ultra', 'pay_4');
        expect(result.plan).toBe('web-ultra');
    });

    it('adds credits for a credit bundle purchase', () => {
        const user = { id: 'u4', email: 'g@h.com', plan: 'free', credits: 300 };
        const run  = jest.fn();
        db.prepare.mockReturnValue(makeStmt({ get: jest.fn().mockReturnValue(user), run }));

        const result = upgradeUserPlan('g@h.com', 'credit-1.5k', 'pay_5');
        expect(result.credits).toBe(1800); // 300 + 1500
        expect(run).toHaveBeenCalled();
    });

    it('returns null for an unrecognised plan name', () => {
        const user = { id: 'u5', email: 'i@j.com', plan: 'free', credits: 0 };
        db.prepare.mockReturnValue(makeStmt({ get: jest.fn().mockReturnValue(user), run: jest.fn() }));

        expect(upgradeUserPlan('i@j.com', 'enterprise-mega', 'pay_6')).toBeNull();
    });
});
