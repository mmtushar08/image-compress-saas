/**
 * Shared Knex instance. Import this everywhere instead of the old
 * better-sqlite3 singleton:  const knex = require('../db');
 */
const knexLib = require('knex');
const config  = require('../../knexfile');

// knexfile spreads the active config at the top level
const knex = knexLib(config);

module.exports = knex;
