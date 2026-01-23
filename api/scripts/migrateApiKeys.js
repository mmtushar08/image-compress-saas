const bcrypt = require('bcrypt');
const db = require('../services/db');

/**
 * Migration Script: Hash existing plain text API keys
 * 
 * This script:
 * 1. Finds all users with plain text API keys
 * 2. Hashes them using bcrypt
 * 3. Stores the hash in apiKeyHash column
 * 4. Keeps original apiKey for verification (remove manually after testing)
 */

async function migrateApiKeys() {
    console.log('🔐 Starting API Key Migration...\n');

    try {
        // Find users with API keys but no hash
        const users = db.prepare('SELECT * FROM users WHERE apiKey IS NOT NULL').all();

        console.log(`Found ${users.length} users with API keys\n`);

        if (users.length === 0) {
            console.log('✅ No users to migrate');
            return;
        }

        let migrated = 0;
        let failed = 0;

        for (const user of users) {
            try {
                // Hash the API key
                const hashedKey = await bcrypt.hash(user.apiKey, 10);

                // Update user with hashed key
                db.prepare('UPDATE users SET apiKeyHash = ? WHERE id = ?')
                    .run(hashedKey, user.id);

                console.log(`✓ Migrated: ${user.email}`);
                migrated++;
            } catch (error) {
                console.error(`✗ Failed: ${user.email} - ${error.message}`);
                failed++;
            }
        }

        console.log(`\n📊 Migration Summary:`);
        console.log(`   ✅ Migrated: ${migrated}`);
        console.log(`   ❌ Failed: ${failed}`);
        console.log(`   📝 Total: ${users.length}\n`);

        if (migrated === users.length) {
            console.log('✅ All API keys successfully migrated!');
            console.log('\n⚠️  IMPORTANT NEXT STEPS:');
            console.log('   1. Test authentication with existing API keys');
            console.log('   2. Verify all users can log in');
            console.log('   3. After verification, manually remove apiKey column:');
            console.log('      ALTER TABLE users DROP COLUMN apiKey;\n');
        } else {
            console.log('⚠️  Some migrations failed. Please review errors above.');
        }

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

// Run migration
migrateApiKeys()
    .then(() => {
        console.log('Migration complete!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Migration error:', error);
        process.exit(1);
    });
