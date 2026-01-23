const db = require('../services/db');

/**
 * Database Migration: Add quota and billing columns
 * 
 * Adds columns for enterprise API features:
 * - plan_id: User's current plan
 * - monthly_limit: Max images per month
 * - used_count: Current month usage
 * - reset_at: When to reset monthly counter
 * - billing_cycle_start: Billing cycle start date
 */

function addQuotaColumns() {
    console.log('🔧 Adding quota and billing columns to users table...\n');

    try {
        // Check if columns already exist
        const tableInfo = db.prepare('PRAGMA table_info(users)').all();
        const columnNames = tableInfo.map(col => col.name);

        // Add plan_id column
        if (!columnNames.includes('plan_id')) {
            db.prepare('ALTER TABLE users ADD COLUMN plan_id TEXT DEFAULT "free"').run();
            console.log('✓ Added plan_id column');
        } else {
            console.log('⚠️  plan_id column already exists');
        }

        // Add monthly_limit column
        if (!columnNames.includes('monthly_limit')) {
            db.prepare('ALTER TABLE users ADD COLUMN monthly_limit INTEGER DEFAULT 500').run();
            console.log('✓ Added monthly_limit column');
        } else {
            console.log('⚠️  monthly_limit column already exists');
        }

        // Add used_count column
        if (!columnNames.includes('used_count')) {
            db.prepare('ALTER TABLE users ADD COLUMN used_count INTEGER DEFAULT 0').run();
            console.log('✓ Added used_count column');
        } else {
            console.log('⚠️  used_count column already exists');
        }

        // Add reset_at column
        if (!columnNames.includes('reset_at')) {
            // Set reset_at to first day of next month
            const nextMonth = new Date();
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            nextMonth.setDate(1);
            nextMonth.setHours(0, 0, 0, 0);

            db.prepare('ALTER TABLE users ADD COLUMN reset_at TEXT').run();

            // Initialize reset_at for all users
            db.prepare('UPDATE users SET reset_at = ?').run(nextMonth.toISOString());

            console.log('✓ Added reset_at column');
        } else {
            console.log('⚠️  reset_at column already exists');
        }

        // Add billing_cycle_start column
        if (!columnNames.includes('billing_cycle_start')) {
            db.prepare('ALTER TABLE users ADD COLUMN billing_cycle_start TEXT').run();

            // Initialize to current date for existing users
            db.prepare('UPDATE users SET billing_cycle_start = ?').run(new Date().toISOString());

            console.log('✓ Added billing_cycle_start column');
        } else {
            console.log('⚠️  billing_cycle_start column already exists');
        }

        console.log('\n✅ Quota columns migration complete!\n');

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

// Run migration
addQuotaColumns();
