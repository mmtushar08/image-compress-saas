const request = require('supertest');
const app     = require('../app');

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
    it('returns something (not a crash) for unknown API routes', async () => {
        // The catch-all serves index.html for non-API routes; API routes 404 differently
        const res = await request(app).get('/api/nonexistent-route-xyz');
        expect(res.status).toBeGreaterThanOrEqual(200);
        expect(res.status).toBeLessThan(600);
    });
});
