jest.mock('../../repositories/apiKeyRepository', () => ({
    findActiveByIndex:    jest.fn(),
    findActiveLegacyKeys: jest.fn().mockResolvedValue([]),
    updateLastUsed:       jest.fn().mockResolvedValue(1),
}));
jest.mock('../../repositories/userRepository', () => ({
    findById:            jest.fn(),
    incrementUsage:      jest.fn().mockResolvedValue(1),
    decrementCredits:    jest.fn().mockResolvedValue(1),
    incrementDailyUsage: jest.fn().mockResolvedValue(1),
}));
jest.mock('../../repositories/guestLimitRepository', () => ({
    findByIp:  jest.fn(),
    increment: jest.fn().mockResolvedValue(),
}));
jest.mock('../../utils/logger', () => ({
    info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn(),
}));
jest.mock('bcrypt', () => ({
    hash: jest.fn().mockResolvedValue('$2b$10$mockedhash'),
    compareSync: jest.fn().mockReturnValue(false),
}));

const { computeKeyIndex, checkLimit, checkGuestLimit, incrementGuestUsage } = require('../usageService');
const apiKeyRepo = require('../../repositories/apiKeyRepository');
const userRepo   = require('../../repositories/userRepository');
const guestRepo  = require('../../repositories/guestLimitRepository');

describe('computeKeyIndex()', () => {
    it('returns a 64-character hex SHA-256 string', () => {
        const idx = computeKeyIndex('sk_test_key_abc123');
        expect(idx).toHaveLength(64);
        expect(idx).toMatch(/^[a-f0-9]+$/);
    });

    it('is deterministic — same key produces same index', () => {
        const key = 'sk_abc_def_ghi';
        expect(computeKeyIndex(key)).toBe(computeKeyIndex(key));
    });

    it('produces different indices for different keys', () => {
        expect(computeKeyIndex('key-a')).not.toBe(computeKeyIndex('key-b'));
    });
});

describe('checkLimit()', () => {
    beforeEach(() => jest.clearAllMocks());

    it('returns allowed:false when API key is not found', async () => {
        apiKeyRepo.findActiveByIndex.mockResolvedValue(null);
        apiKeyRepo.findActiveLegacyKeys.mockResolvedValue([]);

        const result = await checkLimit('sk_unknown_key');
        expect(result.allowed).toBe(false);
        expect(result.user).toBeNull();
    });

    it('returns allowed:true when user is within their apiCredits', async () => {
        apiKeyRepo.findActiveByIndex.mockResolvedValue({ id: 'k1', userId: 'u1', status: 'active' });
        userRepo.findById.mockResolvedValue({ id: 'u1', plan: 'api-pro', usage: 10, apiCredits: 5000, credits: 0, dailyUsage: 0, invoiceDetails: '{}', webLimit: 20 });

        const result = await checkLimit('sk_real');
        expect(result.allowed).toBe(true);
    });

    it('returns allowed:false when monthly credits are exhausted and no credits', async () => {
        apiKeyRepo.findActiveByIndex.mockResolvedValue({ id: 'k2', userId: 'u2', status: 'active' });
        userRepo.findById.mockResolvedValue({ id: 'u2', plan: 'api-pro', usage: 5000, apiCredits: 5000, credits: 0, dailyUsage: 0, invoiceDetails: '{}', webLimit: 20 });

        const result = await checkLimit('sk_depleted');
        expect(result.allowed).toBe(false);
        expect(result.error).toMatch(/limit/i);
    });

    it('falls back to credit balance when monthly credits exhausted', async () => {
        apiKeyRepo.findActiveByIndex.mockResolvedValue({ id: 'k3', userId: 'u3', status: 'active' });
        userRepo.findById.mockResolvedValue({ id: 'u3', plan: 'api-pro', usage: 5000, apiCredits: 5000, credits: 500, dailyUsage: 0, invoiceDetails: '{}', webLimit: 20 });

        const result = await checkLimit('sk_credits');
        expect(result.allowed).toBe(true);
    });
});

describe('checkGuestLimit()', () => {
    beforeEach(() => jest.clearAllMocks());
    const TODAY = new Date().toISOString().split('T')[0];

    it('reports 25 remaining for an unseen IP', async () => {
        guestRepo.findByIp.mockResolvedValue(undefined);
        const stats = await checkGuestLimit('1.2.3.4');
        expect(stats.remaining).toBe(25);
        expect(stats.usage).toBe(0);
        expect(stats.limit).toBe(25);
    });

    it('returns correct remaining when some usage exists today', async () => {
        guestRepo.findByIp.mockResolvedValue({ count: 10, date: TODAY });
        const stats = await checkGuestLimit('5.6.7.8');
        expect(stats.usage).toBe(10);
        expect(stats.remaining).toBe(15);
    });

    it('treats rows from a previous day as 0 usage', async () => {
        guestRepo.findByIp.mockResolvedValue({ count: 20, date: '2020-01-01' });
        const stats = await checkGuestLimit('9.9.9.9');
        expect(stats.usage).toBe(0);
        expect(stats.remaining).toBe(25);
    });

    it('caps remaining at 0 when limit is exceeded', async () => {
        guestRepo.findByIp.mockResolvedValue({ count: 30, date: TODAY });
        const stats = await checkGuestLimit('10.0.0.1');
        expect(stats.remaining).toBe(0);
    });
});

describe('incrementGuestUsage()', () => {
    it('delegates to the guest repository with today\'s date', async () => {
        jest.clearAllMocks();
        await incrementGuestUsage('1.1.1.1');
        const today = new Date().toISOString().split('T')[0];
        expect(guestRepo.increment).toHaveBeenCalledWith('1.1.1.1', today);
    });
});
