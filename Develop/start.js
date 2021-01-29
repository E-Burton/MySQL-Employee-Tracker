// Dependencies
// const db = require("./queries");
const connection = require("./connection");
const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const { query } = require("./connection");
const db = require("./queries");

// Connecting to database Starting Menu
connection.connect((err) => {
    if (err) throw err;
    menu(); // Calling menu function
});

// Menu Function - Providing list of actions & asking what user would like to do
const menu = () => {
    inquirer.prompt({
        name: "request",
        type: "list",
        message: `What would you like to do?`,
        choices: [
            "View Employees",
            "View Departments",
            "View Roles",
            "Add Employee",
            "Add Department",
            "Add Role",
            "Update Employee Role",
            `EXIT \n`, 
        ],
    }).then((answer) => {
        // Creating switch cases for list actions in menu function to call corresponding function
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
            case "Update Employee Role":
                updateEmployeeRole();
                break;
            case "EXIT":
                process.abort();
        };
    });
};

// Function to view all employess including: title/role, department, salary, and manager
const viewEmployees = () => {
    const query = "SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id JOIN role ON e.role_id = role.id JOIN department ON department.id = department_id"
    connection.query(query, (err, data) => {
        if (err) throw err;
        console.table(data); // Displaying employee info in database
        menu(); // Calling menu function
    });
};

// Function to view all departments
const viewDepartments = () => {
    const query = "SELECT name AS departments FROM department";
    connection.query(query, (err, data) => {
        if (err) throw err;
        console.table(data); // Displaying all departments in database
        menu(); // Calling main menu function
    });
};

// Function to view all roles
const viewRoles = () => {
    const query = "SELECT title AS roles FROM role";
    connection.query(query, (err, data) => {
        if (err) throw err;
        console.table(data); // Displaying all roles in database
        menu(); // Calling main menu function
    });
};

// Function to add new department to database
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
        // Inserting user input for department into database
        const query = "INSERT INTO department SET ?";
        connection.query(query, {name}, (err) => {
            if (err) throw err;
            console.log(`${name} department successfully added!`);
            menu(); // Calling main menu
        });
    });
};

// Function to add new role to database
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
                // Creatting array to display department options for new role
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
            // Query to find id for selected department for new role
            const departmentIdQuery = "SELECT id FROM department WHERE ?";
            let department_id;
            connection.query(departmentIdQuery, {name: departmentName}, (err, data) => {
                if (err) throw err;
                department_id = data;
            })
            // Inserting new role/title with salary and department id into database
            const query = "INSERT INTO role SET ?";
            connection.query(query, {title, salary, department_id}, (err) => {
                console.log(`${title} Role successfully added!`);
                if (err) throw err;
                menu(); // Calling main menu
            });
        });
    });
};

// Function to add new employee to database
const addEmployee = () => {
    // Query to select all employee names and roles and id's for both in database
    const query = "SELECT CONCAT(e.first_name, ' ', e.last_name) AS manager, e.id AS managerId, role.title AS role_title, role.id AS roleId FROM employee e LEFT JOIN role ON e.id = role.id";
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
                // Creating array to display options for roles within database
                choices () {
                    const choiceArray = [];
                    data.forEach(({ role_title }) => {
                        choiceArray.push(role_title);
                    });
                    // Removing any null values for role_title in database
                    const filtered = choiceArray.filter(Boolean);
                    return filtered;
                },
            },
            {
                name: "managerName",
                type: "list",
                message: "Who is the employee's manager?",
                // Creating arry to display options for manager within database
                choices () {
                    const choiceArray = [];
                    data.forEach(({ manager }) => {
                        choiceArray.push(manager);
                    });
                    choiceArray.push("NONE"); // Pushing value of 'None' if none of employees/managers listed apply 
                    // Removing any null values for manager in database
                    const filtered = choiceArray.filter(Boolean);
                    return filtered;
                },
            },
        ])
        .then(({first_name, last_name, title, managerName}) => {
            let manager_id;
            let role_id;
            data.forEach(entry => {
                // For each entry, if manager selected from list matches manager in database
                if (entry.manager === managerName) {
                    manager_id = entry.managerId; // Set value of manager_id equal to employee/manager id
                } 
                // For each entry, if role selected from list matches title/role in database
                if (entry.role_title === title) {
                    role_id = entry.roleId; // Set value of role_id equal to role/title id
                }
            })
            // Insert employee's first and last name, role id, and manager id into database
            const query = "INSERT INTO employee SET ?";
            connection.query(query, {first_name, last_name, role_id, manager_id}, (err) => {
                if (err) throw err;
                console.log(`${first_name} ${last_name} successfully added as employee!`);
                menu(); // Calling main menu
            });
        });
    });
};

// Function to update employee role in database
const updateEmployeeRole = () => {
    // Query to select all employees, roles and id's for both in database
    const query = "SELECT CONCAT(e.first_name, ' ', e.last_name) as employee_name, e.id AS employeeId, role.title AS role_title, role.id AS roleId FROM employee e LEFT JOIN role on e.id = role.id"
    connection.query(query, (err, data) => {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "employeeName",
                type: 'list',
                message: "Which employee's role would you like to update?",
                choices () {
                    // Creating array to display all employee options from database
                    const choiceArray = [];
                    data.forEach(({ employee_name }) => {
                        choiceArray.push(employee_name);
                    });
                    // Removing any null values for employee_name in database
                    const filtered = choiceArray.filter(Boolean);
                    return filtered;
                }
            },
            {
                name: "updatedRole",
                type: 'list',
                message: "What is the employees new role?",
                choices() {
                    // Creating array to display all roles in databse from which to choose
                    const choiceArray = [];
                    data.forEach(({ role_title }) => {
                        choiceArray.push(role_title);
                    });
                    // Removing any null values for role_title in database
                    const filtered = choiceArray.filter(Boolean);
                    return filtered;
                },
            },
        ]).then(({ employeeName, updatedRole}) => {
            let employeeId;
            let roleId;
            data.forEach(entry => {
                // For each entry if employee selected from list matches employee from database
                if (entry.employee_name === employeeName) {
                    employeeId = entry.employeeId; // Set employeeId equal to employee id in database
                }
                // For each entry if updated role selected from list matches role from database
                if (entry.role_title === updatedRole) {
                    roleId = entry.roleId; // Set roleId equl to role id in database
                }
            });
            // Query to update employee role with user selection
            const query = "UPDATE employee SET role_id = ? WHERE `id` = ?";
            connection.query(query, [roleId, employeeId], (err) => {
              if (err) throw err;
              console.log(`Role for ${employeeName} has successfully been updated to ${updatedRole}`);
              menu();  // Calling main menu
            })
        });
    });
};

// const validateDepartment = (name) => {
//     let eval = [];
//     const query = "SELECT name FROM department";
//     const response = connection.query(query, (err, data) => {
//         let departments = [];
//         if (err) throw err;
//         data.forEach(value => departments.push(value.name));
//         console.log(`\n All Departments: ${departments}`);
//         return  departments;
//     });

//     console.log(response);
//     response.forEach(value => {
//         // console.log((`\n ${department.name}`));
//         // console.log((`${department.name} is ${department.name === name}`));
//         eval.push(value === name);
//         console.log(`\n Eval array contains: ${eval}`);
//     });

//     if(eval.includes(true)) {
//         console.log(`\n Eval array includes true value: ${eval.includes(true)}`);
//         return false;
//     } else {
//         console.log(`\n Eval array includes true value: ${eval.includes(true)}`);
//         return ` \n ${name} department already exists. Hit backspace to enter valid department.`;
//     }; 
// };