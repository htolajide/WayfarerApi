import debug from 'debug';
import pool from '../database/dbconnect';

export default {
  create: (req, res) => {
    // check if user is admin
    const { token, userid } = req.cookies;
    // create trip if user is admin
    const {
      busId, origin, destination, fare,
    } = req.body;
    pool.query('SELECT is_admin FROM users WHERE id = $1', [userid], (error, results) => {
      if (error) {
        throw error;
      }
      if (results.rows[0].is_admin === false) return res.jsend.error('Only admin can can create trips');
      pool.query('INSERT INTO trips (bus_id, origin, destination, fare) VALUES ($1, $2, $3, $4) RETURNING id, status', [busId, origin, destination, fare], (erro, result) => {
        if (erro) {
          throw erro;
        }
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
      });
      return null;
    });
    // disconnect client
    pool.on('remove', () => {
      debug('app:*')('Client Removed');
      process.exit(0);
    });
    return null;
  },
  seeAllTrips: (req, res) => {
    pool.query('SELECT * FROM trips ORDER BY id ASC', (error, results) => {
      if (error) {
        throw error;
      }
      return res.jsend.success(results.rows);
    });
    // disconnect client
    pool.on('remove', () => {
      debug('app:*')('Client Removed');
      process.exit(0);
    });
  },
  cancelTrip: (req, res) => {
    const { params: { tripId } } = req;
    const id = parseInt(tripId, 10);
    const { status } = req.body;
    const { userid } = req.cookies;
    pool.query('SELECT is_admin FROM users WHERE id = $1', [userid], (error, results) => {
      if (error) {
        throw error;
      }
      if (results.rows[0].is_admin === false) return res.jsend.error('Only admin can cancel trip');
      pool.query('UPDATE trips SET status = $1  WHERE id = $2', [status, id], () => {
        if (error) {
          throw error;
        }
        return res.jsend.success({ message: 'Trip cancelled successfully' });
      });
      return null;
    });
    // disconnect client
    pool.on('remove', () => {
      debug('app:*')('Client Removed');
      process.exit(0);
    });
  },
};
