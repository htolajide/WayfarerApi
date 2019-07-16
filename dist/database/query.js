

const _pg = _interopRequireDefault(require('pg'));

require('make-runnable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// get node postgres connector
const config = require('../config').development;

const pool = new _pg.default.Pool(config);
pool.on('connect', () => {
  console.log('connected to the Database');
});

const createTables = function createTables() {
  const user = 'CREATE TABLE IF NOT EXISTS \n     user( \n        id SERIAL PRIMARY KEY, \n        email VARCHAR NOT NULL,\n        first_name VARCHAR NOT NULL,\n        last_name VARCHAR NOT NULL,\n        password VARCHAR NOT NULL,\n        is_admin BOOLEAN FALSE\n        )';
  pool.query(user).then((res) => {
    console.log(res);
    pool.end();
  }).catch((err) => {
    console.log(err);
    pool.end();
  });
  const bus = 'CREATE TABLE IF NOT EXISTS\n      bus(\n        id SERIAL PRIMARY KEY,\n        number_plate VARCHAR NOT NULL,\n        manufacturer VARCHAR NOT NULL,\n        model VARCHAR NOT NULL,\n        year VARCHAR NOT NULL,\n        capacity INT NOT NULL\n      )';
  pool.query(bus).then((res) => {
    console.log(res);
    pool.end();
  }).catch((err) => {
    console.log(err);
    pool.end();
  });
  const trip = 'CREATE TABLE IF NOT EXISTS\n      trip(\n        id SERIAL PRIMARY KEY,\n        bus_id INT NOT NULL,\n        origin VARCHAR NOT NULL,\n        destination VARCHAR NOT NULL,\n        trip_date DATETIME NOW,\n        fare FOAT NOT NULL,\n        status INT NOT NULL\n      )';
  pool.query(trip).then((res) => {
    console.log(res);
    pool.end();
  }).catch((err) => {
    console.log(err);
    pool.end();
  });
  const booking = 'CREATE TABLE IF NOT EXISTS\n      booking(\n        id SERIAL PRIMARY KEY,\n        trip_id INT NOT NULL,\n        user_id INT NOT NULL,\n        created_on DATETIME NOW\n      )';
  pool.query(booking).then((res) => {
    console.log(res);
    pool.end();
  }).catch((err) => {
    console.log(err);
    pool.end();
  });
};

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});

const getUsers = function getUsers(request, response) {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error;
    }

    response.status(200).json(results.rows);
  });
};

const getUserById = function getUserById(request, response) {
  const id = parseInt(request.params.id);
  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }

    response.status(200).json(results.rows);
  });
};

const createUser = function createUser(request, response) {
  const _request$body = request.body;
  const { name } = _request$body;
  const { email } = _request$body;
  pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], (error, results) => {
    if (error) {
      throw error;
    }

    response.status(201).send('User added with ID: '.concat(result.insertId));
  });
};

const updateUser = function updateUser(request, response) {
  const id = parseInt(request.params.id);
  const _request$body2 = request.body;
  const { name } = _request$body2;
  const { email } = _request$body2;
  pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3', [name, email, id], (error, results) => {
    if (error) {
      throw error;
    }

    response.status(200).send('User modified with ID: '.concat(id));
  });
};

const deleteUser = function deleteUser(request, response) {
  const id = parseInt(request.params.id);
  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }

    response.status(200).send('User deleted with ID: '.concat(id));
  });
}; // export utilities to be accessible  from any where within the application


module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  createTables,
  Pool,
};
