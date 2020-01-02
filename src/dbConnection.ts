/**
 * Holds the connection to the PostgreSQL database. Any module that needs a connection to 
 * the database can `require` this module and use `client`.
 */


import pg = require('pg');

// We use `postgres` as the URL, because it resolves to the Postgres container when run on 
// the Docker network we've set up.
// We're treating the pool as a "client" because we aren't using transactions.
export const client = new pg.Pool({
    host: process.env.DB_HOST || 'postgres',
    user: process.env.DB_USER || 'docker',
    password: process.env.DB_PASS || 'docker',
    database: 'qc',
    max: 20,
});
