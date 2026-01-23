const crypto = require('crypto');
const db = require('./api/services/db');

// Create a test user with a specific API Key for testing
const email = 'test_runner_' + Date.now() + '@example.com';
const apiKey = 'sk_test_' + crypto.randomBytes(12).toString('hex');
const userId = crypto.randomUUID();

try {
    db.prepare(`INSERT INTO users (
    id, email, apiKey, plan, webLimit, apiCredits, usage, dailyUsage, credits, createdAt
  ) VALUES (?, ?, ?, ?, ?, ?, 0, 0, 0, ?)`)
        .run(
            userId, email, apiKey, 'api-pro',
            20, 5000, // 5000 credits for testing
            new Date().toISOString()
        );

    console.log(apiKey);
} catch (err) {
    console.error('Failed to create user:', err);
    process.exit(1);
}
