const mysql = require("mysql");

// Creating database connection
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "10chickee21",
    database: "employee_tracker",
});

module.exports = connection;