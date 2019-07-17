import debug from 'debug';
import pool from '../database/dbconnect';
// import tables from '../models/tables';

// tables.createTripTable();

export default {
  create: (req, res) => {
    // check if user is admin
    const { token, userid } = req.cookies;
    // create trip if user is admin
    const {
      busId, origin, destination, fare,
    } = req.body;
    try {
      pool.query('SELECT is_admin FROM users WHERE id = $1', [userid], (error, results) => {
        if (!error) {
          if (results.rows[0].is_admin === false) return res.jsend.error('Only admin can can create trips');
        }
        pool.query('INSERT INTO trips (bus_id, origin, destination, fare) VALUES ($1, $2, $3, $4) RETURNING id, status', [busId, origin, destination, fare], (err, result) => {
          if (!err) {
            return res.jsend.success({
              trip_id: result.rows[0].id,
              bus_id: busId,
              Origin: origin,
              Destination: destination,
              trip_date: Date.now(),
              status: result.rows[0].status,
              Fare: fare,
              user_id: userid,
              Token: token,
            });
          }
          return res.jsend.error(error);
        });
        return null;
      });
    } catch (error) { debug('app:*')('Error Occured: Something wrong @createTrips'); }
    // disconnect client
    pool.on('remove', () => {
      debug('app:*')('Client Removed @ createTrips');
    });
  },
  seeAllTrips: (req, res) => {
    try {
      pool.query('SELECT * FROM trips ORDER BY id ASC', (error, results) => {
        if (!error) return res.jsend.success(results.rows);
        return res.jsend.error(error);
      });
    } catch (error) { debug('app:*')('Error Occured: Something wrong @seeAllTrips'); }
    // disconnect client
    pool.on('remove', () => {
      debug('app:*')('Client Removed @seeAllTrips');
    });
  },
  cancelTrip: (req, res) => {
    const id = parseInt(req.params.tripId, 10);
    const { status } = req.body;
    const { userid } = req.cookies;
    try {
      pool.query('SELECT is_admin FROM users WHERE id = $1', [userid], (error, results) => {
        if (!error) {
          if (results.rows[0].is_admin === false) return res.jsend.error('Only admin can cancel trip');
          pool.query('UPDATE trips SET status = $1  WHERE id = $2', [status, id], (err, result) => {
            if (result) return res.jsend.success({ message: 'Trip cancelled successfully' });
            return null;
          });
        }
        return null;
      });
    } catch (error) { debug('app:*')('Error Occured: something went wrong @cancellTrips'); }
    // disconnect client
    pool.on('remove', () => {
      debug('app:*')('Client Removed @cancel trip');
    });
  },
};
