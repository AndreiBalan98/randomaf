const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'rem',
  password: 'cosmonet',
  port: 5432,
});

module.exports = pool;