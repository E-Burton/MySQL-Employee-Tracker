// Dependencies
// const db = require("./queries");
const connection = require("./connection");
const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const { query } = require("./connection");

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
            "Add Employee",
            "Add Department",
            "Add Role",
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
            case "Add Employee":
                addEmployee();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Add Role":
                addRole();
                break;
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

const addRole = () => {
    const query = "SELECT name FROM department";
    connection.query(query, (err, data) => {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "title",
                type: "input",
                message: "What is the title of the role you would like to add?",
            },
            {
                name: "departmentName",
                type: "rawlist",
                message: "Under which department should this role be listed?",
                choices () {
                    const choiceArray = [];
                    data.forEach(({ name }) => {
                        choiceArray.push(name);
                    })
                    return choiceArray;
                },
            },
            {
                name: "salary",
                type: "input",
                message: `What is the salary for this role?`,
            },
        ])
        .then(({title, departmentName, salary}) => {
            const departmentIdQuery = "SELECT id FROM department WHERE ?";
            let department_id;
            connection.query(departmentIdQuery, {name: departmentName}, (err, data) => {
                if (err) throw err;
                department_id = data;
            })
            const query = "INSERT INTO role SET ?";
            connection.query(query, {title, salary, department_id}, (err) => {
                if (err) throw err;
                menu();
            });
        });
    });
};

const addEmployee = () => {
    console.log("I'm in the add Employee function!");
    const query = "SELECT CONCAT(e.first_name, ' ', e.last_name) AS manager, e.id AS managerId, role.title AS role_title, role.id AS roleId FROM employee e JOIN role ON e.id = role.id";
    connection.query(query, (err, data) => {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "first_name",
                type: "input",
                message: "What is the first name of the employee you would like to add?",
            },
            {
                name: "last_name",
                type: "input",
                message: "What is the last name of the employee you would like to add?",
            },
            {
                name: "title",
                type: "list",
                message: "What is the employee's role?",
                choices () {
                    const choiceArray = [];
                    data.forEach(({ role_title }) => {
                        choiceArray.push(role_title);
                    });
                    return choiceArray;
                },
            },
            {
                name: "managerName",
                type: "list",
                message: "Who is the employee's manager?",
                choices () {
                    const choiceArray = [];
                    // Add NONE option for manager with null value
                    data.forEach(({ manager }) => {
                        choiceArray.push(manager);
                    });
                    return choiceArray;
                },
            },
        ])
        .then(({first_name, last_name, title, managerName}) => {
            let manager_id;
            let role_id;
            data.forEach(entry => {
                if (entry.manager === managerName) {
                    manager_id = entry.managerId;
                }

                if (entry.role_title === title) {
                    role_id = entry.roleId;
                }
            })
            console.log(`The manager ID for ${managerName} is ${manager_id}`);
            console.log(`The role ID for ${title} is ${role_id}`);
            const query = "INSERT INTO employee SET ?";
            connection.query(query, {first_name, last_name, role_id, manager_id}, (err) => {
                if (err) throw err;
                menu();
            });
        });
    })
};

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