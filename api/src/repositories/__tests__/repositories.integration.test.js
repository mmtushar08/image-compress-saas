/**
 * Integration test — exercises the real Knex query builder + migrations against
 * a throwaway SQLite database (no mocks). This validates that the data layer and
 * schema actually work end to end; the same query-builder code runs on Postgres.
 */
const knex = require('../../db');
const { runMigrations } = require('../../db/migrate');
const userRepo  = require('../userRepository');
const apiKeyRepo = require('../apiKeyRepository');
const guestRepo = require('../guestLimitRepository');
const downloadTokenRepo = require('../downloadTokenRepository');

beforeAll(async () => {
    await runMigrations();
});

afterAll(async () => {
    await knex.destroy();
});

describe('migrations', () => {
    it('creates all four core tables', async () => {
        expect(await knex.schema.hasTable('users')).toBe(true);
        expect(await knex.schema.hasTable('api_keys')).toBe(true);
        expect(await knex.schema.hasTable('download_tokens')).toBe(true);
        expect(await knex.schema.hasTable('guest_limits')).toBe(true);
    });
});

describe('userRepository', () => {
    const user = {
        id: 'u_int_1', email: 'int@test.com', name: 'Int Test', plan: 'free',
        webLimit: 20, apiCredits: 500, usage: 0, dailyUsage: 0, credits: 0,
        createdAt: new Date().toISOString(), invoiceDetails: '{}',
    };

    it('creates and reads a user by id and email', async () => {
        await userRepo.create(user);
        const byId = await userRepo.findById('u_int_1');
        const byEmail = await userRepo.findByEmail('int@test.com');
        expect(byId.email).toBe('int@test.com');
        expect(byEmail.id).toBe('u_int_1');
    });

    it('increments usage atomically', async () => {
        await userRepo.incrementUsage('u_int_1', new Date().toISOString());
        const u = await userRepo.findById('u_int_1');
        expect(Number(u.usage)).toBe(1);
    });

    it('updates a user by id', async () => {
        await userRepo.updateById('u_int_1', { plan: 'web-pro' });
        const u = await userRepo.findById('u_int_1');
        expect(u.plan).toBe('web-pro');
    });

    it('counts users and aggregates', async () => {
        expect(await userRepo.countAll()).toBeGreaterThanOrEqual(1);
        const breakdown = await userRepo.planBreakdown();
        expect(Array.isArray(breakdown)).toBe(true);
    });

    it('lists users with a search filter', async () => {
        const { users, total } = await userRepo.listUsers({ search: 'int@', limit: 10, offset: 0 });
        expect(total).toBeGreaterThanOrEqual(1);
        expect(users[0].email).toContain('int@');
    });
});

describe('apiKeyRepository', () => {
    it('creates a key and finds it by active index', async () => {
        await apiKeyRepo.create({
            id: 'k_int_1', userId: 'u_int_1', keyHash: 'hash', keyIndex: 'idx_abc',
            name: 'Default', prefix: 'sk_aaa...', createdAt: new Date().toISOString(), status: 'active',
        });
        const found = await apiKeyRepo.findActiveByIndex('idx_abc');
        expect(found.id).toBe('k_int_1');

        const prefix = await apiKeyRepo.findActivePrefixByUserId('u_int_1');
        expect(prefix.prefix).toBe('sk_aaa...');
    });
});

describe('guestLimitRepository', () => {
    it('increments guest usage per IP for today', async () => {
        const today = new Date().toISOString().split('T')[0];
        await guestRepo.increment('8.8.8.8', today);
        await guestRepo.increment('8.8.8.8', today);
        const row = await guestRepo.findByIp('8.8.8.8');
        expect(Number(row.count)).toBe(2);
        expect(row.date).toBe(today);
    });

    it('resets count to 1 when the stored date is stale', async () => {
        await guestRepo.increment('7.7.7.7', '2020-01-01');
        const today = new Date().toISOString().split('T')[0];
        await guestRepo.increment('7.7.7.7', today);
        const row = await guestRepo.findByIp('7.7.7.7');
        expect(Number(row.count)).toBe(1);
        expect(row.date).toBe(today);
    });
});

describe('downloadTokenRepository', () => {
    it('creates, finds, marks used, and purges tokens', async () => {
        const expiresAt = new Date(Date.now() + 60000).toISOString();
        await downloadTokenRepo.create({ token: 'a'.repeat(64), filename: 'x.webp', userId: 'u_int_1', ip: '1.1.1.1', expiresAt });

        const rec = await downloadTokenRepo.findByToken('a'.repeat(64));
        expect(rec.filename).toBe('x.webp');
        expect(Number(rec.used)).toBe(0);

        await downloadTokenRepo.markUsed('a'.repeat(64));
        const used = await downloadTokenRepo.findByToken('a'.repeat(64));
        expect(Number(used.used)).toBe(1);

        const purged = await downloadTokenRepo.purgeExpiredOrUsed(new Date().toISOString());
        expect(purged).toBeGreaterThanOrEqual(1);
    });
});
