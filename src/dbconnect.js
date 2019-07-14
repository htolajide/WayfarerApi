// get node postgres connector
import pg from 'pg';
import debug from 'debug';

const config = {
  user: 'postgres', // this is the db user credential
  database: 'wayfarer',
  password: 'olajide4me',
  port: 5433,
  max: 100, // max number of clients in the pool
  idleTimeoutMillis: 30000,
};
const pool = pg.Pool(config);
pool.on('connect', () => {
  debug('connected to the Database');
});
module.exports = pool;
