
  //import pool from './dbconnect';
  const pool = require('./dbconnect'); 
  pool.on('connect', () => {
    console.log('connected to the Database');
  });
const createTable = () => {
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
}
const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  });
  pool.on('remove', () => {
    console.log('client removed');
    process.exit(0);
  });
}
const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
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
}

const createUser = (request, response) => {
  const { email, first_name, last_name, password, is_admin } = request.body
  pool.query('INSERT INTO users (email, first_name, last_name, password, is_admin) VALUES ($1, $2, $3, $4, $5)', [email, first_name, last_name, password, is_admin], (error, results) => {
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
}

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const {  email, first_name, last_name, password, is_admin } = request.body

  pool.query(
    'UPDATE users SET email = $1, first_name = $2, last_name = $3, password = $4, is_amdin = $5 WHERE id = $6',
    [ email, first_name, last_name, password, is_admin, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  );
  //disconnect client
  pool.on('remove', () => {
    console.log('client removed');
    process.exit(0);
  });
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  });
  //disconnect client
  pool.on('remove', () => {
    console.log('client removed');
    process.exit(0);
  });
}
//export utilities to be accessible  from any where within the application
module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  createTable
}
require ('make-runnable');