const mysql = require('mysql2/promise');
require('dotenv').config();
const pool = mysql.createPool({
  host: process.env.HOST || 'localhost',
  user: process.env.USER || 'root',
  password: process.env.PASSWORD || '',
  database: process.env.NAME || 'proj_int',
  port: process.env.PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
});
module.exports = pool;

