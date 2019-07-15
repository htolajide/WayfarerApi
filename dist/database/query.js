"use strict";

var _pg = _interopRequireDefault(require("pg"));

require("make-runnable");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//get node postgres connector
var config = require('../config').development;

var pool = new _pg["default"].Pool(config);
pool.on('connect', function () {
  console.log('connected to the Database');
});

var createTables = function createTables() {
  var user = "CREATE TABLE IF NOT EXISTS \n     user( \n        id SERIAL PRIMARY KEY, \n        email VARCHAR NOT NULL,\n        first_name VARCHAR NOT NULL,\n        last_name VARCHAR NOT NULL,\n        password VARCHAR NOT NULL,\n        is_admin BOOLEAN FALSE\n        )";
  pool.query(user).then(function (res) {
    console.log(res);
    pool.end();
  })["catch"](function (err) {
    console.log(err);
    pool.end();
  });
  var bus = "CREATE TABLE IF NOT EXISTS\n      bus(\n        id SERIAL PRIMARY KEY,\n        number_plate VARCHAR NOT NULL,\n        manufacturer VARCHAR NOT NULL,\n        model VARCHAR NOT NULL,\n        year VARCHAR NOT NULL,\n        capacity INT NOT NULL\n      )";
  pool.query(bus).then(function (res) {
    console.log(res);
    pool.end();
  })["catch"](function (err) {
    console.log(err);
    pool.end();
  });
  var trip = "CREATE TABLE IF NOT EXISTS\n      trip(\n        id SERIAL PRIMARY KEY,\n        bus_id INT NOT NULL,\n        origin VARCHAR NOT NULL,\n        destination VARCHAR NOT NULL,\n        trip_date DATETIME NOW,\n        fare FOAT NOT NULL,\n        status INT NOT NULL\n      )";
  pool.query(trip).then(function (res) {
    console.log(res);
    pool.end();
  })["catch"](function (err) {
    console.log(err);
    pool.end();
  });
  var booking = "CREATE TABLE IF NOT EXISTS\n      booking(\n        id SERIAL PRIMARY KEY,\n        trip_id INT NOT NULL,\n        user_id INT NOT NULL,\n        created_on DATETIME NOW\n      )";
  pool.query(booking).then(function (res) {
    console.log(res);
    pool.end();
  })["catch"](function (err) {
    console.log(err);
    pool.end();
  });
};

pool.on('remove', function () {
  console.log('client removed');
  process.exit(0);
});

var getUsers = function getUsers(request, response) {
  pool.query('SELECT * FROM users ORDER BY id ASC', function (error, results) {
    if (error) {
      throw error;
    }

    response.status(200).json(results.rows);
  });
};

var getUserById = function getUserById(request, response) {
  var id = parseInt(request.params.id);
  pool.query('SELECT * FROM users WHERE id = $1', [id], function (error, results) {
    if (error) {
      throw error;
    }

    response.status(200).json(results.rows);
  });
};

var createUser = function createUser(request, response) {
  var _request$body = request.body,
      name = _request$body.name,
      email = _request$body.email;
  pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], function (error, results) {
    if (error) {
      throw error;
    }

    response.status(201).send("User added with ID: ".concat(result.insertId));
  });
};

var updateUser = function updateUser(request, response) {
  var id = parseInt(request.params.id);
  var _request$body2 = request.body,
      name = _request$body2.name,
      email = _request$body2.email;
  pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3', [name, email, id], function (error, results) {
    if (error) {
      throw error;
    }

    response.status(200).send("User modified with ID: ".concat(id));
  });
};

var deleteUser = function deleteUser(request, response) {
  var id = parseInt(request.params.id);
  pool.query('DELETE FROM users WHERE id = $1', [id], function (error, results) {
    if (error) {
      throw error;
    }

    response.status(200).send("User deleted with ID: ".concat(id));
  });
}; //export utilities to be accessible  from any where within the application


module.exports = {
  getUsers: getUsers,
  getUserById: getUserById,
  createUser: createUser,
  updateUser: updateUser,
  deleteUser: deleteUser,
  createTables: createTables,
  Pool: Pool
};