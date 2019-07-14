import debug from 'debug';
import bcrypt from 'bcrypt';
import pool from '../dbconnect';

const Users = {
  // create user table if not exist
  createTable: () => {
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
        debug(res);
        pool.end();
      })
      .catch((err) => {
        debug(err);
        pool.end();
      });
  },

  getUsers: (request, response) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    });
    // disconnect client after operation
    pool.on('remove', () => {
      debug('client removed');
      process.exit(0);
    });
  },

  getUserById: (request, response) => {
    const id = parseInt(request.params.id, 10);
    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    });
    // disconnect client after operation
    pool.on('remove', () => {
      debug('client removed');
      process.exit(0);
    });
  },
  getUserByEmail: (request) => {
    const { email } = request.body;
    pool.query('SELECT email FROM users WHERE email = $1', [email], (error, results) => {
      if (error) {
        throw error;
      }
      return results.rows[0];
    });
    // disconnect client after operation
    pool.on('remove', () => {
      debug('client removed');
      process.exit(0);
    });
  },
  login: async (request, response) => {
    const { email, password } = request.body;
    pool.query('SELECT * FROM users WHERE email = $1 and password= $2', [email, await bcrypt.hash(password, 10)], (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    });
    // disconnect client after operation
    pool.on('remove', () => {
      debug('client removed');
      process.exit(0);
    });
  },
  createUser: async (request, response) => {
    const {
      email, firstName, lastName, password, isAdmin,
    } = request.body;
    pool.query('INSERT INTO users (email, first_name, last_name, password, is_admin) VALUES ($1, $2, $3, $4, $5)', [email, firstName, lastName, await bcrypt.hash(password, 10), isAdmin], (error, results) => {
      if (error) {
        throw error;
      }
      response.jsend.success(`User added with ID: ${results.insertId}`);
    });
    // disconnect client
    pool.on('remove', () => {
      debug('client removed');
      process.exit(0);
    });
  },

  updateUser: (request, response) => {
    const id = parseInt(request.params.id, 10);
    const {
      email, firstName, lastName, password, isAdmin,
    } = request.body;
    pool.query(
      'UPDATE users SET email = $1, first_name = $2, last_name = $3, password = $4, is_amdin = $5 WHERE id = $6',
      [email, firstName, lastName, password, isAdmin, id],
      (error) => {
        if (error) {
          throw error;
        }
        response.status(200).send(`User modified with ID: ${id}`);
      },
    );
    // disconnect client after operation
    pool.on('remove', () => {
      debug('client removed');
      process.exit(0);
    });
  },

  deleteUser: (request, response) => {
    const id = parseInt(request.params.id, 10);
    pool.query('DELETE FROM users WHERE id = $1', [id], (error) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`User deleted with ID: ${id}`);
    });
    // disconnect client after operation
    pool.on('remove', () => {
      debug('client removed');
      process.exit(0);
    });
  },
};
// export utilities to be accessible  from any where within the application
export default Users;
require('make-runnable');
