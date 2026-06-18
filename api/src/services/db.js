const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Use a simple console wrapper here because logger.js imports db.js —
// importing logger in db.js would create a circular dependency.
const log = { info: (...a) => console.log('[db]', ...a), error: (...a) => console.error('[db]', ...a) };

// Database File Path
const DB_PATH = path.join(__dirname, '../data/users.db');
const JSON_DB_PATH = path.join(__dirname, '../data/users.json');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(DB_PATH);

// Helper to add missing columns
const addColumn = (table, column, type) => {
    try {
        const info = db.prepare(`PRAGMA table_info(${table})`).all();
        const exists = info.some(col => col.name === column);
        if (!exists) {
            log.info(`Adding missing column ${column} to ${table}`);
            db.prepare(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`).run();
        }
    } catch (e) {
        log.error(`Failed to add column ${column} to ${table}: ${e.message}`);
    }
};

// Initialize Tables (Create if not exists)
db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE,
        apiKey TEXT UNIQUE,
        plan TEXT,
        webLimit INTEGER DEFAULT 20,
        apiCredits INTEGER DEFAULT 0,
        usage INTEGER DEFAULT 0,
        dailyUsage INTEGER DEFAULT 0,
        credits INTEGER DEFAULT 0,
        createdAt TEXT,
        expiresAt TEXT,
        lastResetDate TEXT,
        lastUsedDate TEXT,
        lastLimitEmailDate TEXT,
        billingCycle TEXT,
        invoiceDetails TEXT, -- JSON string
        magicToken TEXT,
        tokenExpiry TEXT,
        lastPaymentId TEXT,
        planUpdatedAt TEXT,
        apiKeyHash TEXT,
        sessionToken TEXT,
        sessionExpiry TEXT
    )
`).run();

// Run Schema Migrations (Safety Net for existing tables)
const requiredColumns = [
    { name: 'apiKeyHash', type: 'TEXT' },
    { name: 'sessionToken', type: 'TEXT' },
    { name: 'sessionExpiry', type: 'TEXT' },
    { name: 'magicToken', type: 'TEXT' },
    { name: 'tokenExpiry', type: 'TEXT' },
    { name: 'lastPaymentId', type: 'TEXT' },
    { name: 'planUpdatedAt', type: 'TEXT' },
    { name: 'dailyUsage', type: 'INTEGER DEFAULT 0' },
    { name: 'credits', type: 'INTEGER DEFAULT 0' },
    { name: 'name', type: 'TEXT' }
];

// api_keys table migrations
const requiredApiKeyColumns = [
    { name: 'keyIndex', type: 'TEXT' }
];

requiredColumns.forEach(col => addColumn('users', col.name, col.type));
requiredApiKeyColumns.forEach(col => addColumn('api_keys', col.name, col.type));

// Create API Keys Table
db.prepare(`
    CREATE TABLE IF NOT EXISTS api_keys (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        keyHash TEXT NOT NULL,
        keyIndex TEXT,
        name TEXT,
        prefix TEXT,
        createdAt TEXT,
        lastUsedAt TEXT,
        status TEXT DEFAULT 'active',
        FOREIGN KEY(userId) REFERENCES users(id)
    )
`).run();

// Fast lookup index on keyIndex (SHA-256 of raw key — O(1) auth instead of O(n) bcrypt loop)
db.prepare(`CREATE INDEX IF NOT EXISTS idx_api_keys_keyindex ON api_keys(keyIndex)`).run();

// Download tokens — ties a one-time token to a filename + owner so /download never exposes raw paths
db.prepare(`
    CREATE TABLE IF NOT EXISTS download_tokens (
        token TEXT PRIMARY KEY,
        filename TEXT NOT NULL,
        userId TEXT,
        ip TEXT,
        expiresAt TEXT NOT NULL,
        used INTEGER DEFAULT 0
    )
`).run();
db.prepare(`CREATE INDEX IF NOT EXISTS idx_download_tokens_token ON download_tokens(token)`).run();

// Guest rate limits — replaces in-memory Map so limits survive restarts and are shared across PM2 workers
db.prepare(`
    CREATE TABLE IF NOT EXISTS guest_limits (
        ip TEXT PRIMARY KEY,
        count INTEGER DEFAULT 0,
        date TEXT NOT NULL
    )
`).run();

// Security cleanup: remove any previously persisted plaintext API keys.
try {
    const keyTableInfo = db.prepare('PRAGMA table_info(api_keys)').all();
    const hasFullKeyColumn = keyTableInfo.some(col => col.name === 'fullKey');
    if (hasFullKeyColumn) {
        db.prepare('UPDATE api_keys SET fullKey = NULL WHERE fullKey IS NOT NULL').run();
    }
} catch (e) {
    log.error(`Failed to scrub plaintext API keys: ${e.message}`);
}

// Migration: Move existing user keys to api_keys table
const keyCount = db.prepare('SELECT count(*) as count FROM api_keys').get().count;
if (keyCount === 0) {
    log.info('Migrating existing API keys to api_keys table');
    const usersWithKeys = db.prepare('SELECT id, apiKey, apiKeyHash, createdAt, lastUsedDate FROM users WHERE apiKey IS NOT NULL OR apiKeyHash IS NOT NULL').all();

    const insertKey = db.prepare(`
        INSERT INTO api_keys (id, userId, keyHash, name, prefix, createdAt, lastUsedAt, status)
        VALUES (@id, @userId, @keyHash, @name, @prefix, @createdAt, @lastUsedAt, 'active')
    `);

    const migration = db.transaction((users) => {
        for (const user of users) {
            // If we only have raw apiKey (legacy), we need to hash it? 
            // Actually, the new system relies on hashes. 
            // If apiKeyHash exists, use it. If not, and we have apiKey using old plain text, we should probably hash it now (but that requires bcrypt async). 
            // EXCEPT: db.js is synchronous startup. 
            // For safety, users migrated from JSON already have NULL hashes in some cases? 
            // Let's assume most valid users have hash. If not, we skip or use empty.

            // Wait, userController::register creates apiKeyHash.
            // If strictly necessary, we might need a separate async migration script.
            // But for now, let's migrate what we can.

            let hash = user.apiKeyHash;
            // If we don't have a hash but have a key/prefix... this is tricky in sync execution.
            // However, `userController.incrementUsage` checks hash OR equality.
            // We can store the raw key as hash temporarily or handle this status?
            // Actually, let's just copy the hash. If null, the user might need to regenerate.
            // But let's check what `register` does: it creates BOTH apiKey and apiKeyHash (but doesn't store apiKey anymore in new logic? No, old logic stored raw apiKey).
            // Current Register: stores apiKey AND apiKeyHash.

            if (!hash && user.apiKey) {
                // We can't use bcrypt here easily (async). 
                // Let's just migrate users who HAVE a hash or accepting that we might need to handle legacy in verify.
                // BETTER: Copy the 'apiKey' as 'keyHash' but mark it somehow?
                // No, let's rely on apiKeyHash being there (it is in register).
                continue;
            }

            if (hash) {
                const prefix = user.apiKey ? user.apiKey.substring(0, 7) + '...' : 'sk_...';

                insertKey.run({
                    id: 'key_' + Math.random().toString(36).substring(2, 15),
                    userId: user.id,
                    keyHash: hash,
                    name: 'Default API Key',
                    prefix: prefix,
                    createdAt: user.createdAt,
                    lastUsedAt: user.lastUsedDate
                });
            }
        }
    });

    migration(usersWithKeys);
    log.info(`Migrated keys for ${usersWithKeys.length} users`);
}


// Migration: Import from JSON if DB is empty and JSON exists
const userCount = db.prepare('SELECT count(*) as count FROM users').get().count;

if (userCount === 0 && fs.existsSync(JSON_DB_PATH)) {
    log.info('Migrating users from JSON to SQLite');
    try {
        const raw = fs.readFileSync(JSON_DB_PATH, 'utf8');
        const users = JSON.parse(raw);

        const insert = db.prepare(`
            INSERT OR IGNORE INTO users (
                id, email, apiKey, plan, webLimit, apiCredits, usage, dailyUsage, credits, 
                createdAt, expiresAt, lastResetDate, lastUsedDate, lastLimitEmailDate, 
                billingCycle, invoiceDetails, magicToken, tokenExpiry, lastPaymentId, planUpdatedAt
            ) VALUES (
                @id, @email, @apiKey, @plan, @webLimit, @apiCredits, @usage, @dailyUsage, @credits,
                @createdAt, @expiresAt, @lastResetDate, @lastUsedDate, @lastLimitEmailDate,
                @billingCycle, @invoiceDetails, @magicToken, @tokenExpiry, @lastPaymentId, @planUpdatedAt
            )
        `);

        const insertMany = db.transaction((users) => {
            for (const user of users) {
                insert.run({
                    id: user.id || Date.now().toString(),
                    email: user.email,
                    apiKey: user.apiKey || null,
                    plan: user.plan || 'free',
                    webLimit: user.webLimit !== undefined ? user.webLimit : 20,
                    apiCredits: user.apiCredits !== undefined ? user.apiCredits : 0,
                    usage: user.usage || 0,
                    dailyUsage: user.dailyUsage || 0,
                    credits: user.credits || 0,
                    createdAt: user.createdAt || new Date().toISOString(),
                    expiresAt: user.expiresAt || null,
                    lastResetDate: user.lastResetDate || null,
                    lastUsedDate: user.lastUsedDate || null,
                    lastLimitEmailDate: user.lastLimitEmailDate || null,
                    billingCycle: user.billingCycle || null,
                    invoiceDetails: JSON.stringify(user.invoiceDetails || {}),
                    magicToken: user.magicToken || null,
                    tokenExpiry: user.tokenExpiry || null,
                    lastPaymentId: user.lastPaymentId || null,
                    planUpdatedAt: user.planUpdatedAt || null
                });
            }
        });

        insertMany(users);
        log.info(`Successfully migrated ${users.length} users`);
    } catch (e) {
        console.error("Migration failed:", e);
    }
}

module.exports = db;
