const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Database File Path
const DB_PATH = path.join(__dirname, '../data/users.db');
const JSON_DB_PATH = path.join(__dirname, '../data/users.json');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(DB_PATH);

// Initialize Tables
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

// Migration: Import from JSON if DB is empty and JSON exists
const userCount = db.prepare('SELECT count(*) as count FROM users').get().count;

if (userCount === 0 && fs.existsSync(JSON_DB_PATH)) {
    console.log("Migrating users from JSON to SQLite...");
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
        console.log(`Successfully migrated ${users.length} users.`);
    } catch (e) {
        console.error("Migration failed:", e);
    }
}

module.exports = db;
