/**
 * Holds the connection to the PostgreSQL database. Any module that needs a connection to 
 * the database can `require` this module and use `client`, which has been connected in the 
 * main `server.js` file.
 */


import pg = require('pg');

// We use `postgres` as the URL, because it resolves to the Postgres container when run on 
// the Docker network.
const client = new pg.Client({connectionString: process.env.DB_URL || 'postgresql://postgres@postgres:5432/qc'});

export = {client};
