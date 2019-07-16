import debug from 'debug';
import pool from '../database/dbconnect';
// import tables from '../models/tables';

// tables.createBookingTable();

export default {
  create: (req, res) => {
    // get userid from cookies
    const { userid } = req.cookies;
    // get is admin from user
    const { tripId, sitNumber } = req.body;
    try {
      pool.query('INSERT INTO bookings (trip_id, user_id, sit_number) VALUES ($1, $2, $3) RETURNING id', [tripId, userid, sitNumber], (error, results) => {
        pool.query(`SELECT bus_id, trip_date, origin, destination, fare, first_name, last_name, email  FROM trips INNER JOIN bookings on trips.id = bookings.trip_id 
          INNER JOIN users on bookings.user_id = users.id where bookings.id = $1`, [results.rows[0].id], (err, result) => {
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
    } catch (error) { debug('app:*')('Error Occured: Something wrong @createTrips'); }
    // disconnect client
    pool.on('remove', () => {
      debug('app:*')('Client Removed @ createTrips');
    });
    return null;
  },
};
