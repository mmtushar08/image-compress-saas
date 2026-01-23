const db = require('../services/db');

/**
 * Database Migration: Add security columns
 * 
 * Adds:
 * - apiKeyHash: For storing hashed API keys
 * - sessionToken: For cookie-based authentication
 * - sessionExpiry: Session expiration timestamp
 */

function addSecurityColumns() {
    console.log('🔧 Adding security columns to users table...\n');

    try {
        // Check if columns already exist
        const tableInfo = db.prepare('PRAGMA table_info(users)').all();
        const columnNames = tableInfo.map(col => col.name);

        // Add apiKeyHash column if it doesn't exist
        if (!columnNames.includes('apiKeyHash')) {
            db.prepare('ALTER TABLE users ADD COLUMN apiKeyHash TEXT').run();
            console.log('✓ Added apiKeyHash column');
        } else {
            console.log('⚠️  apiKeyHash column already exists');
        }

        // Add sessionToken column if it doesn't exist
        if (!columnNames.includes('sessionToken')) {
            db.prepare('ALTER TABLE users ADD COLUMN sessionToken TEXT').run();
            console.log('✓ Added sessionToken column');
        } else {
            console.log('⚠️  sessionToken column already exists');
        }

        // Add sessionExpiry column if it doesn't exist
        if (!columnNames.includes('sessionExpiry')) {
            db.prepare('ALTER TABLE users ADD COLUMN sessionExpiry TEXT').run();
            console.log('✓ Added sessionExpiry column');
        } else {
            console.log('⚠️  sessionExpiry column already exists');
        }

        console.log('\n✅ Database migration complete!');
        console.log('   You can now run: node scripts/migrateApiKeys.js\n');

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

// Run migration
addSecurityColumns();
