const os     = require('os');
const path   = require('path');
const crypto = require('crypto');

// Each test FILE gets its own isolated SQLite file so migrations + data are clean
const unique = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
process.env.TEST_DB_PATH       = path.join(os.tmpdir(), `shrinkix-test-${unique}.db`);
process.env.DB_CLIENT          = 'sqlite3';
process.env.NODE_ENV           = 'test';
process.env.STRIPE_SECRET_KEY  = 'sk_test_dummy';
process.env.FRONTEND_URL       = 'http://localhost:5173';
process.env.LOG_LEVEL          = 'warn'; // reduce test output noise
