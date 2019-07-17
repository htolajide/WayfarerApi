// get debug module for debugging mode
import debug from 'debug';
// get postgres connection pool for database query
import pool from '../database/dbconnect';

const database = {
  // create user tables if not exist
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
        debug('app:*')(`table users is available ${res}`);
      })
      .catch((err) => {
        debug('app:*')(err);
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
        debug('app:*')(`table bus is available ${res}`);
      })
      .catch((err) => {
        debug('app:*')(err);
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
        debug('app:*')(`table trips is available ${res}`);
      })
      .catch((err) => {
        debug('app:*')(err);
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
        debug('app:*')(`table bookings is available ${res}`);
      })
      .catch((err) => {
        debug('app:*')(err);
      });
  },
  disconnect: () => {
    // disconnect client
    pool.on('remove', () => {
      debug('app:database')('Tables created successfully, conection removed');
    });
  },
};
// export utilities to be accessible  from any where within the application
export default database;
