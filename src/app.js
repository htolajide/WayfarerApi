import '@babel/polyfill';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import jsend from 'jsend';
import morgan from 'morgan';

import v1Router from './routes';

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('combined'));
app.use(jsend.middleware);

app.use('/api/v1', v1Router);

app.get('*', (req, res) => res.jsend.success('Invana!!!'));

const port = parseInt(process.env.PORT, 10) || 4000;

app.listen(port, () => console.log(`Live at ${port}`));
