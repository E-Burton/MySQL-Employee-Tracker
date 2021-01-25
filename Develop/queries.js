// Dependencies
const mysql = require("mysql");
const connection = require("./connection");
const consoleTable = require("console.table");

class DB {

    viewEmployees () {
        const query = "SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id JOIN role ON e.role_id = role.id JOIN department ON department.id = department_id";
        const queryResults = connection.query(query, (err, data) => {
            if (err) throw err;
            return JSON.stringify(data);
        });
        console.log(queryResults);
        return console.table(queryResults);
    }
};

module.exports = new DB;

