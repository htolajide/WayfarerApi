import jwt from 'jsonwebtoken';
import debug from 'debug';
import bcrypt from 'bcrypt';
import pool from '../dbconnect';

export default {
  signup: (req, res) => {
    // check for existence
    const {
      email, firstName, lastName, password, isAdmin,
    } = req.body;
    pool.query('SELECT email FROM users WHERE email = $1', [email], async (error, results, next) => {
      if (error) {
        throw error;
      }
      if (results.rows[0] === undefined) {
        pool.query('INSERT INTO users (email, first_name, last_name, password, is_admin) VALUES ($1, $2, $3, $4, $5) RETURNING id', [email, firstName, lastName, await bcrypt.hash(password, 10), isAdmin], (err, result) => {
          if (err) {
            throw err;
          }
          // signin jwt and wrap in a cookie
          const token = jwt.sign({ userId: results.insertId }, process.env.SECRET);
          res.cookie('userid', result.rows[0].id, { expires: new Date(Date.now() + 3600000), httpOnly: true });
          res.cookie('token', token, { expires: new Date(Date.now() + 3600000), httpOnly: true });
          return res.jsend.success(`User added with ID: ${result.rows[0].id} and login with this token: ${token}`);
        });
      } if (results.rows[0].email === email) return res.jsend.fail('Email address already exists.');
      return next();
    });
    // disconnect client after operation
    pool.on('remove', () => {
      debug('app:login')('client removed');
      process.exit(0);
    });
  },
  // get all users
  seeUser: (req, res) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
      if (error) {
        throw error;
      }
      return res.jsend.success(results.rows);
    });
    // disconnect client after operation
    pool.on('remove', () => {
      debug('app:login')('client removed');
      process.exit(0);
    });
  },
  login: async (req, res) => {
    const { email, password, isAdmin } = req.body;
    pool.query('SELECT id, password FROM users WHERE email = $1 and is_admin= $2', [email, isAdmin], async (error, results) => {
      if (error) {
        throw error;
      }
      if (results.rows[0] === undefined) return res.jsend.fail('Login failed, check your inputs');
      const match = await bcrypt.compare(password, results.rows[0].password);
      if (!match) {
        return res.jsend.fail('Login failed, check your password');
      }
      // sign jwt and wrap in a cookie
      const token = jwt.sign({ userId: results.rows[0].id }, process.env.SECRET);
      res.cookie('userid', results.rows[0].id, { expires: new Date(Date.now() + 3600000), httpOnly: true });
      res.cookie('token', token, { expires: new Date(Date.now() + 3600000), httpOnly: true });
      return res.jsend.success(token);
    });
    // disconnect client after operation
    pool.on('remove', () => {
      debug('app:login')('client removed');
      process.exit(0);
    });
  },
};
