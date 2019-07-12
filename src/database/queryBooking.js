  //code adapter from Tania Rascia @ https://blog.logrocket.com/setting-up-a-restful-api-with-node-js-and-postgresql-d96d6fc892d8/
  //import pool from './dbconnect';
  const pool = require('./dbconnect');
  pool.on('connect', () => {
    console.log('connected to the Database');
  });
const createTable = () => {
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
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
 //disconnect client
 pool.on('remove', () => {
    console.log('client removed');
    process.exit(0);
  });
};
const getBookings = (request, response) => {
  pool.query('SELECT * FROM bookings ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  });
  //disconnect client
  pool.on('remove', () => {
    console.log('client removed');
    process.exit(0);
  });
};
const getBookingById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM bookings WHERE user_id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  });
  //disconnect client
  pool.on('remove', () => {
    console.log('client removed');
    process.exit(0);
  });
};

const createBooking = (request, response) => {
  const { trip_id, user_id, sit_number } = request.body
  pool.query('INSERT INTO bookings (trip_id, user_id, sit_number) VALUES ($1, $2, $3)', [trip_id, user_id, sit_number], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`User added with ID: ${result.insertId}`)
  });
  //disconnect client
  pool.on('remove', () => {
    console.log('client removed');
    process.exit(0);
  });
};

const updateBooking = (request, response) => {
  const id = parseInt(request.params.id)
  const { trip_id, user_id, sit_number} = request.body

  pool.query(
    'UPDATE bookings SET trip_id = $1, user_id = $2, sit_number=$3 WHERE id = $4',
    [trip_id, user_id, sit_number, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Booking modified with ID: ${id}`)
    }
  );
  //disconnect client
  pool.on('remove', () => {
    console.log('client removed');
    process.exit(0);
  });
};

const deleteBooking = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM bookings WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Booking deleted with ID: ${id}`)
  });
  //disconnect client
  pool.on('remove', () => {
    console.log('client removed');
    process.exit(0);
  });
};
//export utilities to be accessible  from any where within the application
module.exports = {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  createTable
};
require ('make-runnable');