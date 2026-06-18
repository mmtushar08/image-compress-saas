/**
 * Audit log — immutable record of security-relevant actions (logins, signups,
 * plan changes, admin overrides). Append-only; nothing updates or deletes rows
 * here in normal operation.
 */

exports.up = async function up(knex) {
    const exists = await knex.schema.hasTable('audit_log');
    if (!exists) {
        await knex.schema.createTable('audit_log', (t) => {
            t.text('id').primary();
            t.text('createdAt').notNullable();
            t.text('actorType');          // user | admin | guest | system
            t.text('actorId');            // user id / admin / null
            t.text('action').notNullable(); // e.g. user.register, auth.login, admin.plan_update
            t.text('targetType');         // user | api_key | ...
            t.text('targetId');
            t.text('ip');
            t.text('metadata');           // JSON string of extra context
            t.index('createdAt', 'idx_audit_created');
            t.index('action', 'idx_audit_action');
            t.index(['actorType', 'actorId'], 'idx_audit_actor');
        });
    }
};

exports.down = async function down(knex) {
    await knex.schema.dropTableIfExists('audit_log');
};
