const Pool = require('pg').Pool; //get node postgres connector
const config = {
    user: 'postgres', //this is the db user credential
    database: 'wayfarer',
    password: 'olajide4me',
    port: 5433,
    max: 100, // max number of clients in the pool
    idleTimeoutMillis: 30000,
  };
const pool = new Pool(config);
module.exports = pool;
