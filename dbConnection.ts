/**
 * Holds the connection to the PostgreSQL database. Any module that needs a connection to 
 * the database can `require` this module and use `client`, which has been connected in the 
 * main `server.js` file.
 */


import pg = require('pg');

const client = new pg.Client({connectionString: process.env.DB_URL || 'postgresql://postgres@127.0.0.1:5432/qc'});

export = {client};
