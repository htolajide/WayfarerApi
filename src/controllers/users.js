import jwt from 'jsonwebtoken';
import debug from 'debug';
import bcrypt from 'bcrypt';
import pool from '../database/dbconnect';

export default {
  signup: async (req, res) => {
    // check for existence
    const {
      email, firstName, lastName, password,
    } = req.body;
    try {
      pool.query('SELECT email FROM users WHERE email = $1', [email], async (error, results) => {
        // user does not exist
        if (results.rows[0] === undefined) {
          pool.query('INSERT INTO users (email, first_name, last_name, password) VALUES ($1, $2, $3, $4) RETURNING id, is_admin', [email, firstName, lastName, await bcrypt.hash(password, 10)], (err, result) => {
            // signin jwt and wrap in a cookie
            const token = jwt.sign({ userId: result.rows[0].id }, process.env.SECRET);
            res.cookie('userid', result.rows[0].id, { expires: new Date(Date.now() + 3600000), httpOnly: true });
            res.cookie('token', token, { expires: new Date(Date.now() + 3600000), httpOnly: true });
            return res.jsend.success({
              user_id: result.rows[0].id,
              is_admin: result.rows[0].is_admin,
              Token: token,
            });
          });
        }
        if (results.rows[0] !== undefined) return res.jsend.error('Email already exists'); // email exists
        return null;
      });
    } catch (error) { debug('app:*')(error); }
    // disconnect client after operation
    pool.on('remove', () => {
      debug('app:login')('client removed @signup');
    });
  },
  // user login logic
  login: async (req, res) => {
    const { email, password } = req.body;
    pool.query('SELECT id, email, password FROM users WHERE email = $1 ', [email], async (error, results) => {
      if (error) {
        throw error;
      }
      if (results.rows[0] === undefined) return res.jsend.error('Login failed, check your inputs');
      const match = await bcrypt.compare(password, results.rows[0].password);
      if (!match) {
        return res.jsend.error({ message: 'Login failed, check your password' });
      }
      // sign jwt and wrap in a cookie
      const token = jwt.sign({ userId: results.rows[0].id }, process.env.SECRET);
      res.cookie('userid', results.rows[0].id, { expires: new Date(Date.now() + 3600000), httpOnly: true });
      res.cookie('token', token, { expires: new Date(Date.now() + 3600000), httpOnly: true });
      return res.jsend.success({
        user_id: results.rows[0].id, isAdmin: results.rows[0].is_admin, Token: token,
      });
    });
    // disconnect client after operation
    pool.on('remove', () => {
      debug('app:login')('client removed @signin');
    });
  },
};
