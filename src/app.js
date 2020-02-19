// to setup eslint airbnb use npm i -D eslint eslint-config-airbnb-base eslint-plugin-import
import '@babel/polyfill';
import debug from 'debug';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import jsend from 'jsend';
import morgan from 'morgan';
import database from './models/tables';

import v1Router from './routes';

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
// use morgan to log at command line
app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
app.use(jsend.middleware);
database.createUserTable();
database.createBookingTable();
database.createTripTable();
database.createBusTable();
database.disconnect();

app.use('/api/v1', v1Router);

app.get('*', (req, res) => res.jsend.success('WayFarerApi'));

const port = parseInt(process.env.PORT, 10) || 4000;

app.listen(port, () => debug('app:*')(`Live at ${port}`));

module.exports = app; // for testing
