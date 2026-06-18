jest.mock('../db', () => ({ prepare: jest.fn() }));
jest.mock('../../utils/logger', () => ({
    info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn(),
}));
jest.mock('bcrypt', () => ({
    hash: jest.fn().mockResolvedValue('$2b$10$mockedhash'),
    compareSync: jest.fn().mockReturnValue(false),
}));

const { computeKeyIndex, checkLimit, checkGuestLimit, incrementGuestUsage } = require('../usageService');
const db = require('../db');

const makeStmt = (overrides = {}) => ({
    get: jest.fn(), run: jest.fn(), all: jest.fn(), ...overrides,
});

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

    it('returns allowed:false when API key is not found', () => {
        // keyIndex lookup returns null; legacy loop returns []
        db.prepare.mockReturnValue(makeStmt({ get: jest.fn().mockReturnValue(null), all: jest.fn().mockReturnValue([]) }));

        const result = checkLimit('sk_unknown_key');
        expect(result.allowed).toBe(false);
        expect(result.user).toBeNull();
    });

    it('returns allowed:true when user is within their apiCredits', () => {
        const apiKey = { id: 'k1', userId: 'u1', keyIndex: computeKeyIndex('sk_real'), keyHash: 'h', status: 'active' };
        const user   = { id: 'u1', plan: 'api-pro', usage: 10, apiCredits: 5000, credits: 0, dailyUsage: 0, invoiceDetails: '{}', webLimit: 20 };

        const getKey  = jest.fn().mockReturnValue(apiKey);
        const getUser = jest.fn().mockReturnValue(user);
        let callCount = 0;
        db.prepare.mockImplementation(() => makeStmt({
            get: jest.fn(() => (callCount++ === 0 ? apiKey : user)),
            all: jest.fn().mockReturnValue([]),
        }));

        const result = checkLimit('sk_real');
        expect(result.allowed).toBe(true);
    });

    it('returns allowed:false when monthly credits are exhausted', () => {
        const apiKey = { id: 'k2', userId: 'u2', keyIndex: computeKeyIndex('sk_depleted'), keyHash: 'h', status: 'active' };
        const user   = { id: 'u2', plan: 'api-pro', usage: 5000, apiCredits: 5000, credits: 0, dailyUsage: 0, invoiceDetails: '{}', webLimit: 20 };

        let callCount = 0;
        db.prepare.mockImplementation(() => makeStmt({
            get: jest.fn(() => (callCount++ === 0 ? apiKey : user)),
            all: jest.fn().mockReturnValue([]),
        }));

        const result = checkLimit('sk_depleted');
        expect(result.allowed).toBe(false);
        expect(result.error).toMatch(/limit/i);
    });

    it('falls back to credit balance when monthly credits exhausted', () => {
        const apiKey = { id: 'k3', userId: 'u3', keyIndex: computeKeyIndex('sk_credits'), keyHash: 'h', status: 'active' };
        const user   = { id: 'u3', plan: 'api-pro', usage: 5000, apiCredits: 5000, credits: 500, dailyUsage: 0, invoiceDetails: '{}', webLimit: 20 };

        let callCount = 0;
        db.prepare.mockImplementation(() => makeStmt({
            get: jest.fn(() => (callCount++ === 0 ? apiKey : user)),
            all: jest.fn().mockReturnValue([]),
        }));

        const result = checkLimit('sk_credits');
        expect(result.allowed).toBe(true);
    });
});

describe('checkGuestLimit()', () => {
    beforeEach(() => jest.clearAllMocks());

    const TODAY = new Date().toISOString().split('T')[0];

    it('reports 25 remaining for an unseen IP', () => {
        db.prepare.mockReturnValue(makeStmt({ get: jest.fn().mockReturnValue(null) }));

        const stats = checkGuestLimit('1.2.3.4');
        expect(stats.remaining).toBe(25);
        expect(stats.usage).toBe(0);
        expect(stats.limit).toBe(25);
    });

    it('returns correct remaining when some usage exists today', () => {
        db.prepare.mockReturnValue(makeStmt({ get: jest.fn().mockReturnValue({ count: 10, date: TODAY }) }));

        const stats = checkGuestLimit('5.6.7.8');
        expect(stats.usage).toBe(10);
        expect(stats.remaining).toBe(15);
    });

    it('treats rows from a previous day as 0 usage', () => {
        db.prepare.mockReturnValue(makeStmt({ get: jest.fn().mockReturnValue({ count: 20, date: '2020-01-01' }) }));

        const stats = checkGuestLimit('9.9.9.9');
        expect(stats.usage).toBe(0);
        expect(stats.remaining).toBe(25);
    });

    it('caps remaining at 0 when limit is exceeded', () => {
        db.prepare.mockReturnValue(makeStmt({ get: jest.fn().mockReturnValue({ count: 30, date: TODAY }) }));

        const stats = checkGuestLimit('10.0.0.1');
        expect(stats.remaining).toBe(0);
    });
});

describe('incrementGuestUsage()', () => {
    it('calls prepare and run without throwing', () => {
        const run = jest.fn();
        db.prepare.mockReturnValue(makeStmt({ run }));

        expect(() => incrementGuestUsage('1.1.1.1')).not.toThrow();
        expect(run).toHaveBeenCalled();
    });
});
