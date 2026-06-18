const os   = require('os');
const path = require('path');

// Each test run gets its own isolated SQLite file so migrations are clean
process.env.TEST_DB_PATH    = path.join(os.tmpdir(), `shrinkix-test-${Date.now()}.db`);
process.env.NODE_ENV        = 'test';
process.env.STRIPE_SECRET_KEY = 'sk_test_dummy';
process.env.FRONTEND_URL    = 'http://localhost:5173';
process.env.LOG_LEVEL       = 'warn'; // reduce test output noise
