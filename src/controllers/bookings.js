import debug from 'debug';
import pool from '../database/dbconnect';

export default {
  create: (req, res) => {
    // get userid from cookies
    const { userid } = req.cookies;
    // get is admin from user
    const { tripId, sitNumber } = req.body;
    try {
      pool.query('INSERT INTO bookings (trip_id, user_id, sit_number) VALUES ($1, $2, $3) RETURNING id', [tripId, userid, sitNumber], (error, results) => {
        pool.query(`SELECT bus_id, trip_date, origin, destination, fare, first_name, last_name, email  FROM trips INNER JOIN bookings on trips.id = bookings.trip_id 
          INNER JOIN users ON bookings.user_id = users.id WHERE bookings.id = $1`, [results.rows[0].id], (err, result) => {
          if (!err) {
            return res.jsend.success({
              booking_id: results.rows[0].id,
              user_id: userid,
              trip_id: tripId,
              trip_date: result.rows[0].trip_date,
              seat_number: sitNumber,
              first_name: result.rows[0].first_name,
              last_name: result.rows[0].last_name,
              email: result.rows[0].email,
              origin: result.rows[0].origin,
              destination: result.rows[0].destination,
              Fare: result.rows[0].fare,
            });
          }
          return res.jsend.error(error);
        });
      });
    } catch (error) { debug('app:*')('Error Occured: Something wrong @createBookings'); }
    // disconnect client
    pool.on('remove', () => {
      debug('app:*')('Client Removed @createBooking');
    });
    return null;
  },
  getBookings: (req, res) => {
    // get userid from cookies
    const { userid } = req.cookies;
    try {
      pool.query('SELECT is_admin FROM users WHERE id = $1', [userid], (error, results) => {
        if (!error) {
          // user is not admin allow to see only his bookings
          if (results.rows[0].is_admin === false) {
            pool.query(`SELECT bookings.id as booking_id, bookings.user_id, trip_id bus_id, trip_date, bookings.sit_number, first_name, last_name, email, origin, destination, fare FROM bookings INNER JOIN users on bookings.user_id = users.id 
              INNER JOIN trips ON bookings.trip_id = trips.id WHERE bookings.user_id = $1 ORDER BY bookings.id ASC`, [userid], (err, result) => {
              if (!err) {
                return res.jsend.success(result.rows);
              }
              return res.jsend.error('error user');
            });
          } else if (results.rows[0].is_admin === true) {
            pool.query(`SELECT bookings.id, bookings.user_id, trip_id bus_id, trip_date, bookings.sit_number, first_name, last_name, email, origin, destination, fare FROM trips INNER JOIN bookings on trips.id = bookings.trip_id 
              INNER JOIN users ON bookings.user_id = users.id  ORDER BY bookings.user_id ASC`, (err, result) => {
              if (!err) {
                return res.jsend.success(result.rows);
              }
              return res.jsend.error('error admin');
            });
          }
        }
      });
    } catch (error) { debug('app:*')(error); }
    // disconnect client
    pool.on('remove', () => {
      debug('app:*')('Client removed @getBookings');
    });
  },
  deleteBooking: (req, res) => {
    const id = parseInt(req.params.bookingId, 10);
    try {
      pool.query('DELETE FROM bookings WHERE id = $1', [id], (error, result) => {
        if (result) {
          res.jsend.success({ message: 'Booking deleted successfully' });
        }
      });
    } catch (error) { debug('app:*')(error); }
    // disconnect client
    pool.on('remove', () => {
      debug('app:*')('Client removed @deleteBooking');
    });
  },
};
