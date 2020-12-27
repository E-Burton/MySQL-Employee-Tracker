// Dependencies
// const db = require("./queries");
const connection = require("./connection");
const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

connection.connect((err) => {
    if (err) throw err;
    menu();
});

const menu = () => {
    inquirer.prompt({
        name: "request",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View Employees",
            "View Departments",
            "View Roles",
            // "Add Employees",
            "Add Departments",
            // "Add Roles",
            // "Update Employee Roles",
            "EXIT", 
        ],
    }).then((answer) => {
        switch (answer.request) {
            case "View Employees":
                viewEmployees();
                break;
            case "View Departments":
                viewDepartments();
                break;
            case "View Roles":
                viewRoles();
                break;
            // case "Add Employees":
            //     addEmployees();
            //     break;
            case "Add Departments":
                addDepartment();
                break;
            // case "Add Roles":
            //     addRoles();
            //     break;
            // case "Update Empoyee Roles":
            //     updateEmployeeRoles();
                // break;
            case "EXIT":
                process.exit();
        }
    });
};

const viewEmployees = () => {
    // const db = new DB();
    // const allEmployees = db.viewEmployees();
    // return allEmployees;
    const query = "SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id JOIN role ON e.role_id = role.id JOIN department ON department.id = department_id"
    connection.query(query, (err, data) => {
        if (err) throw err;
        console.table(data)
        menu();
    });
};

const viewDepartments = () => {
    const query = "SELECT name AS departments FROM department";
    connection.query(query, (err, data) => {
        if (err) throw err;
        console.table(data);
        menu();
    });
};

const viewRoles = () => {
    const query = "SELECT title AS roles FROM role";
    connection.query(query, (err, data) => {
        if (err) throw err;
        console.table(data);
        menu();
    })
};

const addDepartment = () => {
   inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "What department would you like to add?",
            // validate: validateDepartment,
        },
    ])
    .then(({name}) => {
        const query = "INSERT INTO department SET ?";
        connection.query(query, {name}, (err) => {
            if (err) throw err;
            console.log(`${name} department successfully added!`);
            menu();
        });
    });
};

// const addRoles = () => {
//     console.log("I'm in the add Role function!");
//     inquirer.prompt([
//         {
//             name: "title",
//             type: "input",
//             message: "What is the title of the role you would like to add?",
//         },
//         {
//             name: "department_id",
//             type: "input",
//             message: `What is the department ID for ${title}?`,
//         },
//         {
//             name: "id",
//             type: "input",
//             message: `What is the role ID for ${title}?`,
//         },
//         {
//             name: "salary",
//             type: "input",
//             message: `What is the salary for ${title}?`,
//         },
//     ])
//     .then(({title, department_id, id, salary}) => {
//         connection.query("INSERT INTO role SET ?", {id, title, salary, department_id}, (err) => {
//             if (err) throw err;
//             menu();
//         });
//     });
// };

// const addEmployees = () => {
//     console.log("I'm in the add Employee function!");
//     inquirer.prompt([
//         {
//             name: "first_name",
//             type: "input",
//             message: "What is the first name of the employee you would like to add?",
//         },
//         {
//             name: "last_name",
//             type: "input",
//             message: "What is the last name of the employee you would like to add?",
//         },
//         {
//             name: "employeeRole",
//             type: "list",
//             message: "What is the employee's role?",
//             choices () {
//                 const choiceArray = [];
//                 data.forEac
//             }
//         },
//         {
//             name: "salary",
//             type: "input",
//             message: `What is the salary for ${title}?`,
//         },
//     ])
//     .then(({title, department_id, id, salary}) => {
//         connection.query("INSERT INTO role SET ?", {id, title, salary, department_id}, (err) => {
//             if (err) throw err;
//             menu();
//         });
//     });
// };

// const validateDepartment = (name) => {
//     const query = "SELECT name FROM department";
//     const valid =  connection.query(query, (err, data) => {
//         if (err) throw err;
//         const compare = () => {
//             data.forEach(department => {
//                 if(department.name !== name);
//             });
//             return true;
//         }
//         return compare;
//     }); 

//     return valid || `${name} department already exists. Hit backspace to enter valid department.`;
// };