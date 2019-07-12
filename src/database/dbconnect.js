const Pool = require('pg').Pool; //get node postgres connector
const pool = new Pool(process.env.CONFIG);
module.exports = pool;
