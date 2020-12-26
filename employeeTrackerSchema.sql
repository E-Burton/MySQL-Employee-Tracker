DROP DATABASE IF EXISTS employee_tracker;

CREATE DATABASE employee_tracker;

USE employee_tracker;

CREATE TABLE department (
	id INT PRIMARY KEY,
    name VARCHAR(30)
);

CREATE TABLE role (
	id INT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT
);

CREATE TABLE employee (
	id INT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT
);

INSERT INTO role (id, title, salary, department_id) 
VALUES (1, "Sales Lead", 100000, 1), (2, "Salesperson", 80000, 1), (3, "Lead Engineer", 150000, 2), (4, "Software Engineer", 120000, 2), (5, "Accountant", 125000, 3), (6, "Legal Team Lead", 250000, 4), (7, "Lawyer", 190000, 4);

INSERT INTO department (id, name)
VALUES (1, "Sales"), (2, "Engineering"), (3, "Finance"), (4, "Legal");

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, "John", "Doe", 1, 3), (2, "Mike", "Chan", 2, 1), (3, "Ashley", "Rodriguez", 3, null), (4, "Kevin", "Tupik", 4, 3), (6, "Malia", "Brown", 5, null), (7, "Sarah", "Lourd", 6, null), (8, "Tom", "Allen", 7, 7);

SELECT * FROM role;
SELECT * FROM department;
SELECT * FROM employee;