import debug from 'debug';
import pool from '../database/dbconnect';

export default {
  create: (req, res) => {
    // check if user is admin
    const { token, userid } = req.cookies;
    pool.query('SELECT is_admin FROM users WHERE id = $1', [userid], (error, results) => {
      if (error) {
        throw error;
      }
      if (results.rows[0].is_admin === false) return res.jsend.error('You are not eligible to create trips');
      return null;
    });
    // create trip if user is admin
    const {
      busId, origin, destination, fare,
    } = req.body;
    pool.query('INSERT INTO trips (bus_id, origin, destination, fare) VALUES ($1, $2, $3, $4) RETURNING id, status', [busId, origin, destination, fare], (error, results) => {
      if (error) {
        throw error;
      }
      return res.jsend.success({
        trip_id: results.rows[0].id,
        bus_id: busId,
        Origin: origin,
        Destination: destination,
        trip_date: Date.now(),
        status: results.rows[0].status,
        Fare: fare,
        user_id: userid,
        Token: token,
      });
    });
    // disconnect client
    pool.on('remove', () => {
      debug('app:*')('Client Removed');
      process.exit(0);
    });
    return null;
  },
};
