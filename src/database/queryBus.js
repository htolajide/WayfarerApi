
  //import pool from './dbconnect';
  const pool = require('./dbconnect');
  pool.on('connect', () => {
    console.log('connected to the Database');
  });
const createTable = () => {
    

      const bus = `CREATE TABLE IF NOT EXISTS
      bus(
        id SERIAL PRIMARY KEY,
        number_plate VARCHAR NOT NULL,
        manufacturer VARCHAR NOT NULL,
        model VARCHAR NOT NULL,
        year VARCHAR NOT NULL,
        capacity INT NOT NULL
      )`;
  pool.query(bus)
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
  };

const getBus = (request, response) => {
  pool.query('SELECT * FROM bus ORDER BY id ASC', (error, results) => {
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
const getBusById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM bus WHERE id = $1', [id], (error, results) => {
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

const createBus = (request, response) => {
  const {number_plate, maunfacturer, model, year, capacity } = request.body
  pool.query('INSERT INTO bus (number_plate, manufacturer, model, year, capacity) VALUES ($1, $2, $3, $4, $5)', [number_plate, maunfacturer, model, year, capacity], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Bus added with ID: ${result.insertId}`)
  });
  //disconnect client
  pool.on('remove', () => {
    console.log('client removed');
    process.exit(0);
  });
}

const updateBus = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  pool.query(
    'UPDATE bus SET number_plate = $1, manufacturer = $2, model = $3, year = $4, capacity = $5 WHERE id = $6',
    [number_plate, maunfacturer, model, year, capacity, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Bus modified with ID: ${id}`)
    }
  );
  //disconnect client
  pool.on('remove', () => {
    console.log('client removed');
    process.exit(0);
  });
}

const deleteBus = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM bus WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Bus deleted with ID: ${id}`)
  });//disconnect client
  pool.on('remove', () => {
    console.log('client removed');
    process.exit(0);
  });
}
//export utilities to be accessible  from any where within the application
module.exports = {
  getBus,
  getBusById,
  createBus,
  updateBus,
  deleteBus,
  createTable
}
require ('make-runnable');