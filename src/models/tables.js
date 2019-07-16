// get debug module for debugging mode
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
      debug('app:*')('Client removed for usertable');
    });
  },
  createBusTable: () => {
    const bus = `CREATE TABLE IF NOT EXISTS
      bus(
        id SERIAL PRIMARY KEY,
        number_plate VARCHAR NOT NULL,
        manufacturer VARCHAR NOT NULL,
        model VARCHAR NOT NULL,
        year VARCHAR NOT NULL,
        capacity INT NOT NULL
      )`;
    pool.query(bus)
      .then((res) => {
        debug('app:*')(res);
      })
      .catch((err) => {
        debug('app:*')(err);
      });
    // disconnect client
    pool.on('remove', () => {
      debug('app:*')('Client removed for bus table');
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
      })
      .catch((err) => {
        debug('app:*')(err);
      });
    // disconnect client
    pool.on('remove', () => {
      debug('app:*')('Client removed for trip table');
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
      })
      .catch((err) => {
        debug('app:*')(err);
      });
    // disconnect client
    pool.on('remove', () => {
      debug('app:*')('Client removed for booking table');
    });
  },
};
// export utilities to be accessible  from any where within the application
export default tables;
// require('make-runnable');
