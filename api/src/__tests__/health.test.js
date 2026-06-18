const request = require('supertest');
const app     = require('../app');
const knex    = require('../db');

afterAll(async () => {
    await knex.destroy(); // close the connection pool so Jest exits cleanly
});

describe('GET /api/health', () => {
    it('returns 200 with status ok', async () => {
        const res = await request(app).get('/api/health');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('ok');
        expect(res.body.service).toBe('shrinkix-api');
        expect(typeof res.body.uptime).toBe('number');
    });
});

describe('GET /api/nonexistent', () => {
    it('does not crash on unknown routes', async () => {
        const res = await request(app).get('/api/nonexistent-route-xyz');
        expect(res.status).toBeGreaterThanOrEqual(200);
        expect(res.status).toBeLessThan(600);
    });
});
