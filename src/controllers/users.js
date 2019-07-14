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
        pool.query('INSERT INTO users (email, first_name, last_name, password, is_admin) VALUES ($1, $2, $3, $4, $5) RETURNING id', [email, firstName, lastName, await bcrypt.hash(password, 10), isAdmin], (Error, Result) => {
          if (Error) {
            throw Error;
          }
          // signin jwt and wrap in a cookie
          const token = jwt.sign({ userId: Result.rows[0].id }, process.env.SECRET);
          res.cookie('userid', Result.rows[0].id, { expires: new Date(Date.now() + 3600000), httpOnly: true });
          res.cookie('isAdmin', isAdmin, { expires: new Date(Date.now() + 3600000), httpOnly: true });
          res.cookie('token', token, { expires: new Date(Date.now() + 3600000), httpOnly: true });
          return res.jsend.success({
            Email: email,
            Password: password,
            first_name: firstName,
            last_name: lastName,
            is_admin: isAdmin,
          });
        });
      } if (results.rows[0].email === email) return res.jsend.error('Email address already exists.');
      return next();
    });
    // disconnect client after operation
    pool.on('remove', () => {
      debug('app:login')('client removed');
      process.exit(0);
    });
  },
  // user login logic
  login: async (req, res) => {
    const { email, password, isAdmin } = req.body;
    pool.query('SELECT id, password, is_admin FROM users WHERE email = $1 and is_admin= $2', [email, isAdmin], async (error, results) => {
      if (error) {
        throw error;
      }
      if (results.rows[0] === undefined) return res.jsend.error('Login failed, check your inputs');
      const match = await bcrypt.compare(password, results.rows[0].password);
      if (!match) {
        return res.jsend.error('Login failed, check your password');
      }
      // sign jwt and wrap in a cookie
      const token = jwt.sign({ userId: results.rows[0].id }, process.env.SECRET);
      res.cookie('userid', results.rows[0].id, { expires: new Date(Date.now() + 3600000), httpOnly: true });
      res.cookie('isAdmin', isAdmin, { expires: new Date(Date.now() + 3600000), httpOnly: true });
      res.cookie('token', token, { expires: new Date(Date.now() + 3600000), httpOnly: true });
      return res.jsend.success({
        user_id: results.rows[0].id, isAdmin: results.rows[0].is_admin, Token: token,
      });
    });
    // disconnect client after operation
    pool.on('remove', () => {
      debug('app:login')('client removed');
      process.exit(0);
    });
  },
};
