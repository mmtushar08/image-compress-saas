const db = require('../services/db');

/**
 * Database Migration: Add Credit Add-Ons Support
 * 
 * Adds columns to track credit add-ons:
 * - addon_credits: Extra credits purchased for current cycle
 * - addon_history: JSON array of add-on purchases
 */

function addCreditAddOnColumns() {
    console.log('🔧 Adding credit add-on columns to api_keys table...\n');

    try {
        // Check if columns already exist
        const tableInfo = db.prepare('PRAGMA table_info(api_keys)').all();
        const columnNames = tableInfo.map(col => col.name);

        // Add addon_credits column
        if (!columnNames.includes('addon_credits')) {
            db.prepare('ALTER TABLE api_keys ADD COLUMN addon_credits INTEGER DEFAULT 0').run();
            console.log('✓ Added addon_credits column');
        } else {
            console.log('⚠️  addon_credits column already exists');
        }

        // Add addon_history column (JSON array)
        if (!columnNames.includes('addon_history')) {
            db.prepare('ALTER TABLE api_keys ADD COLUMN addon_history TEXT DEFAULT "[]"').run();
            console.log('✓ Added addon_history column');
        } else {
            console.log('⚠️  addon_history column already exists');
        }

        console.log('\n✅ Credit add-on columns migration complete!\n');

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

// Run migration
addCreditAddOnColumns();
