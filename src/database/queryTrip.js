
 // import pool from './dbconnect';
 const pool = require('./dbconnect');
  pool.on('connect', () => {
    console.log('connected to the Database');
  });
const createTable = () => {
    const trip = `CREATE TABLE IF NOT EXISTS
      trips(
        id SERIAL PRIMARY KEY,
        bus_id INT NOT NULL,
        origin VARCHAR NOT NULL,
        destination VARCHAR NOT NULL,
        trip_date TIMESTAMP DEFAULT NOW(),
        fare FLOAT NOT NULL,
        status VARCHAR DEFAULT 'active'
      )`;
  pool.query(trip)
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

const getTrips = (request, response) => {
  pool.query('SELECT * trips users ORDER BY id ASC', (error, results) => {
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
};
const getTripByOrigin = (request, response) => {
  const origin = parseInt(request.params.origin)

  pool.query('SELECT * FROM trips WHERE origin = $1', [origin], (error, results) => {
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
};
const getTripByDestination = (request, response) => {
    const destination = parseInt(request.params.destination)
  
    pool.query('SELECT * FROM trips WHERE destination = $1', [destination], (error, results) => {
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
  };
const createTrip = (request, response) => {
  const { bus_id, origing, destination, fare, status } = request.body
  pool.query('INSERT INTO trip (bus_id, origin, destination, fare, status) VALUES ($1, $2, $3, $4, $5)', [bus_id, origin, destination, fare, status], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Trips created with ID: ${result.insertId}`)
  });
  //disconnect client
  pool.on('remove', () => {
    console.log('client removed');
    process.exit(0);
  });
};

const updateTrip = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  pool.query(
    'UPDATE trips SET bus_id = $1, origin = $2, destination = $3, fare = $4, status = $5 WHERE id = $6',
    [bus_id, origin, destination, fare, status, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Trip modified with ID: ${id}`)
    }
  );
  //disconnect client
  pool.on('remove', () => {
    console.log('client removed');
    process.exit(0);
  });
};

const deleteTrip = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('DELETE FROM trisp WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Trip deleted with ID: ${id}`)
  });
  //disconnect client
  pool.on('remove', () => {
    console.log('client removed');
    process.exit(0);
  });
};
//export utilities to be accessible  from any where within the application
module.exports = {
  getTrips,
  getTripByOrigin,
  getTripByDestination,
  createTrip,
  updateTrip,
  deleteTrip,
  createTable
}
require ('make-runnable');