const config = require('../knexfile.js');
const knex = require('knex');
const configKnex = knex(config.development); // Development mode

configKnex.migrate.latest([config]);

// configKnex.orderBy()

module.exports = configKnex;