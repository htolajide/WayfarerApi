// debug for logging output
import debug from 'debug';
// get postgres connection pool for database query
import pool from '../database/dbconnect';

const tables = {
  // create user table if not exist
  createUserTable: () => {
    const user = `CREATE TABLE IF NOT EXISTS 
       users( 
          id SERIAL PRIMARY KEY, 
          email VARCHAR NOT NULL,
          first_name VARCHAR NOT NULL,
          last_name VARCHAR NOT NULL,
          password VARCHAR NOT NULL,
          is_admin BOOLEAN DEFAULT FALSE
          )`;
    pool.query(user)
      .then((res) => {
        debug('app:*')(res);
        pool.end();
      })
      .catch((err) => {
        debug('app:*')(err);
        pool.end();
      });
    // disconnect client
    pool.on('remove', () => {
      debug('app:*')('Client Removed');
      process.exit(0);
    });
  },
  createTripTable: () => {
    const trip = `CREATE TABLE IF NOT EXISTS
      trips(
        id SERIAL PRIMARY KEY,
        bus_id INT NOT NULL,
        origin VARCHAR NOT NULL,
        destination VARCHAR NOT NULL,
        trip_date TIMESTAMP DEFAULT NOW(),
        fare FLOAT NOT NULL,
        status VARCHAR DEFAULT 'active'
      )`;
    pool.query(trip)
      .then((res) => {
        debug('app:*')(res);
        pool.end();
      })
      .catch((err) => {
        debug('app:*')(err);
        pool.end();
      });
    // disconnect client
    pool.on('remove', () => {
      debug('app:*')('Client Removed');
      process.exit(0);
    });
  },
  createBookingTable: () => {
    const booking = `CREATE TABLE IF NOT EXISTS
      bookings(
        id SERIAL PRIMARY KEY,
        trip_id INT NOT NULL,
        user_id INT NOT NULL,
        sit_number INT NOT NULL,
        created_on TIMESTAMP DEFAULT NOW()
      )`;
    pool.query(booking)
      .then((res) => {
        debug('app:*')(res);
        pool.end();
      })
      .catch((err) => {
        debug('app:*')(err);
        pool.end();
      });
    // disconnect client
    pool.on('remove', () => {
      debug('app:*')('Client Removed');
      process.exit(0);
    });
  },
};
// export utilities to be accessible  from any where within the application
export default tables;
require('make-runnable');
