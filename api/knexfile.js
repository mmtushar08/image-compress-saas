/**
 * Knex configuration — dual dialect.
 *
 *   DB_CLIENT=sqlite3 (default)  → better-sqlite3 file (dev / test / current prod)
 *   DB_CLIENT=pg                 → PostgreSQL via DATABASE_URL (target prod)
 *
 * The same migrations and query-builder code run against both, so switching
 * databases is a config change, not a code change.
 */
const path = require('path');

const migrationsDir = path.join(__dirname, 'src/db/migrations');

const sqliteFile =
    process.env.TEST_DB_PATH || path.join(__dirname, 'src/data/users.db');

const usePg = process.env.DB_CLIENT === 'pg';

const base = {
    migrations: { directory: migrationsDir, tableName: 'knex_migrations' },
};

const sqliteConfig = {
    ...base,
    client: 'better-sqlite3',
    connection: { filename: sqliteFile },
    useNullAsDefault: true,
    // SQLite allows a single writer; a small pool avoids "database is locked"
    pool: {
        min: 1,
        max: 1,
        afterCreate: (conn, done) => {
            // Enforce foreign keys (off by default in SQLite)
            conn.pragma('foreign_keys = ON');
            done(null, conn);
        },
    },
};

const pgConfig = {
    ...base,
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: { min: 2, max: 10 },
};

const config = usePg ? pgConfig : sqliteConfig;

// Knex CLI expects an environment-keyed map; the app imports `config` directly.
module.exports = {
    development: config,
    test: config,
    production: config,
    ...config,
};
