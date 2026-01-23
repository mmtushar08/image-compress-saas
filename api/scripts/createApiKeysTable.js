const db = require('../services/db');
const crypto = require('crypto');

/**
 * Database Migration: Create API Keys Table
 * 
 * Moves quota tracking from user level to API key level
 * Enables: multiple keys per user, web+API separation, team plans
 */

function createApiKeysTable() {
    console.log('🔧 Creating api_keys table...\n');

    try {
        // Create api_keys table
        db.prepare(`
            CREATE TABLE IF NOT EXISTS api_keys (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                key TEXT UNIQUE NOT NULL,
                key_hash TEXT NOT NULL,
                plan_id TEXT DEFAULT 'free',
                monthly_limit INTEGER DEFAULT 500,
                used_count INTEGER DEFAULT 0,
                reset_at TEXT,
                billing_cycle_start TEXT,
                is_sandbox BOOLEAN DEFAULT 0,
                is_active BOOLEAN DEFAULT 1,
                created_at TEXT,
                last_used_at TEXT,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `).run();

        console.log('✓ Created api_keys table\n');

        // Migrate existing users' API keys
        const users = db.prepare('SELECT * FROM users WHERE apiKey IS NOT NULL').all();

        console.log(`Found ${users.length} users with API keys to migrate\n`);

        let migrated = 0;
        let skipped = 0;

        users.forEach(user => {
            try {
                // Check if already migrated
                const existing = db.prepare('SELECT id FROM api_keys WHERE key = ?').get(user.apiKey);
                if (existing) {
                    console.log(`⚠️  Skipped: ${user.email} (already migrated)`);
                    skipped++;
                    return;
                }

                const apiKeyId = crypto.randomUUID();

                // Calculate reset_at if not set
                let resetAt = user.reset_at;
                if (!resetAt) {
                    const nextMonth = new Date();
                    nextMonth.setMonth(nextMonth.getMonth() + 1);
                    nextMonth.setDate(1);
                    nextMonth.setHours(0, 0, 0, 0);
                    resetAt = nextMonth.toISOString();
                }

                db.prepare(`
                    INSERT INTO api_keys (
                        id, user_id, key, key_hash, plan_id,
                        monthly_limit, used_count, reset_at,
                        billing_cycle_start, is_sandbox, is_active,
                        created_at, last_used_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `).run(
                    apiKeyId,
                    user.id,
                    user.apiKey,
                    user.apiKeyHash || '', // Use existing hash if available
                    user.plan_id || user.plan || 'free',
                    user.monthly_limit || 500,
                    user.used_count || 0,
                    resetAt,
                    user.billing_cycle_start || user.createdAt,
                    0, // not sandbox
                    1, // active
                    user.createdAt,
                    user.lastUsedDate
                );

                console.log(`✓ Migrated: ${user.email}`);
                migrated++;

            } catch (err) {
                console.error(`✗ Failed: ${user.email} - ${err.message}`);
            }
        });

        console.log(`\n📊 Migration Summary:`);
        console.log(`   ✅ Migrated: ${migrated}`);
        console.log(`   ⚠️  Skipped: ${skipped}`);
        console.log(`   📝 Total: ${users.length}\n`);

        if (migrated > 0) {
            console.log('✅ API keys table created and populated!\n');
            console.log('⚠️  IMPORTANT: Old columns in users table are preserved for backward compatibility');
            console.log('   You can remove them after verifying everything works:\n');
            console.log('   ALTER TABLE users DROP COLUMN plan_id;');
            console.log('   ALTER TABLE users DROP COLUMN monthly_limit;');
            console.log('   ALTER TABLE users DROP COLUMN used_count;');
            console.log('   ALTER TABLE users DROP COLUMN reset_at;\n');
        }

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

// Run migration
createApiKeysTable();
