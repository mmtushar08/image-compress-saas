/**
 * @deprecated The better-sqlite3 singleton has been replaced by the Knex data
 * layer (src/db) and the repository pattern (src/repositories).
 *
 * Schema is now managed by Knex migrations (src/db/migrations), not created at
 * require-time. This module re-exports the Knex instance purely as a safety net
 * for any remaining `require('../services/db')` references. New code must use a
 * repository instead — do not call `.prepare()` on this object.
 */
module.exports = require('../db');
