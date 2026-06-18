/**
 * Initial schema — mirrors the tables the legacy db.js created at require-time.
 *
 * Guarded with hasTable() so it is a safe no-op on the existing production
 * SQLite database (where these tables already exist) while still creating the
 * full schema on a fresh PostgreSQL or test database.
 *
 * Timestamps are stored as ISO-8601 strings (text) to match every existing
 * row and all current application code, which compares dates as ISO strings.
 */

exports.up = async function up(knex) {
    const hasUsers = await knex.schema.hasTable('users');
    if (!hasUsers) {
        await knex.schema.createTable('users', (t) => {
            t.text('id').primary();
            t.text('email').unique();
            t.text('name');
            t.text('apiKey').unique();
            t.text('plan');
            t.integer('webLimit').defaultTo(20);
            t.integer('apiCredits').defaultTo(0);
            t.integer('usage').defaultTo(0);
            t.integer('dailyUsage').defaultTo(0);
            t.integer('credits').defaultTo(0);
            t.text('createdAt');
            t.text('expiresAt');
            t.text('lastResetDate');
            t.text('lastUsedDate');
            t.text('lastLimitEmailDate');
            t.text('billingCycle');
            t.text('invoiceDetails'); // JSON string
            t.text('magicToken');
            t.text('tokenExpiry');
            t.text('lastPaymentId');
            t.text('planUpdatedAt');
            t.text('apiKeyHash');
            t.text('sessionToken');
            t.text('sessionExpiry');
            t.index('sessionToken', 'idx_users_session');
            t.index('magicToken', 'idx_users_magic');
        });
    }

    const hasApiKeys = await knex.schema.hasTable('api_keys');
    if (!hasApiKeys) {
        await knex.schema.createTable('api_keys', (t) => {
            t.text('id').primary();
            t.text('userId').notNullable();
            t.text('keyHash').notNullable();
            t.text('keyIndex');
            t.text('name');
            t.text('prefix');
            t.text('createdAt');
            t.text('lastUsedAt');
            t.text('status').defaultTo('active');
            t.index('keyIndex', 'idx_api_keys_keyindex');
            t.index('userId', 'idx_api_keys_userid');
        });
    }

    const hasDownloadTokens = await knex.schema.hasTable('download_tokens');
    if (!hasDownloadTokens) {
        await knex.schema.createTable('download_tokens', (t) => {
            t.text('token').primary();
            t.text('filename').notNullable();
            t.text('userId');
            t.text('ip');
            t.text('expiresAt').notNullable();
            t.integer('used').defaultTo(0);
        });
    }

    const hasGuestLimits = await knex.schema.hasTable('guest_limits');
    if (!hasGuestLimits) {
        await knex.schema.createTable('guest_limits', (t) => {
            t.text('ip').primary();
            t.integer('count').defaultTo(0);
            t.text('date').notNullable();
        });
    }
};

exports.down = async function down(knex) {
    // Destructive — only used to fully tear down (e.g. in tests). Order respects FKs.
    await knex.schema.dropTableIfExists('download_tokens');
    await knex.schema.dropTableIfExists('guest_limits');
    await knex.schema.dropTableIfExists('api_keys');
    await knex.schema.dropTableIfExists('users');
};
