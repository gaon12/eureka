const dbAuth = require('../secret/db.json');

var mysql = require('mysql2/promise');
const db = mysql.createPool({
    host: dbAuth.host,
    user: dbAuth.user,
    password: dbAuth.password,
    database: dbAuth.database
});

module.exports = db;