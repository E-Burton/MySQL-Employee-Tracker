// Dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

// Creating database connection
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "10chickee21",
    database: "employee_tracker",
});

connection.connect((err) => {
    if (err) throw err;
    manageEmployees();
});

const manageEmployees = () => {
    inquirer.prompt({
        name: "request",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "Add Departments",
            "Add Roles",
            "Add Employees",
            "View Departments",
            "View Roles",
            "View Employees",
            "Update Employee Roles",
        ],
    }).then((answer) => {
        switch (answer.request) {
            case "Add Departments":
                addDepartment();
                break;
            case "Add Roles":
                addRoles();
                break;
            case "Add Employees":
                addEmployees();
                break;
            case "View Departments":
                viewDepartments();
                break;
            case "View Roles":
                viewRoles();
                break;
            case "View Employees":
                viewEmployees();
                break;
            case "Update Empoyee Roles":
                updateEmployeeRoles();
                break;
            default:
                console.log(`Invalid action: ${answer.request}`);
                break;

        }
    });
};