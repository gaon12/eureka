const dbAuth = require('../secret/db.json');

var mysql = require('mysql2');
var db = mysql.createConnection({
    host: dbAuth.host,
    user: dbAuth.user,
    password: dbAuth.password,
    database: dbAuth.database
});
db.connect();

module.exports = db;