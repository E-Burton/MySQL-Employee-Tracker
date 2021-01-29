# MySQL-Employee-Tracker

## Objective

Create a Content Management System (CMS) for managing a company's employees using node, inquirer, and MySQL.

## Table of Contents

* [Objective](#objective)
* [Table of Contents](#table-of-contents)
* [User Story and Criteria](#user-story-and-criteria)
* [Video Walkthrough](#video-walkthrough)
* [Tools Implemented](#tools-implemented)
* [Installation](#installation)
* [Challenges](#challenges)
* [Additional Resources](#additional-resources)

## User Story and Criteria

```
As a business owner
I want to be able to view and manage the departments, roles, and employees in my company
So that I can organize and plan my business

GIVEN a command-line application
THEN I am prompted with a menu of actions 
WHEN I select add department
THEN I am prompted to input the name of the department
WHEN I select add role
THEN I am prompted to input the title of the role, select the department for the role, and input the salary for the role
WHEN I select add employee
THEN I am prompted to input the employee's name, select their role, and manager
WHEN I  select view employees
THEN I am presented with a table that details employee id, name, title, department, salary, and manager
WHEN I select view departments
THEN I am presented with a list of current departments
WHEN I select view roles
THEN I am presented with a list of current roles

```

## Video Walkthrough

[Click]() to see a video demonstrationg the functionality of the CMS application.

## Tools Implemented

* JavaScript
* Node.js
* Inqurier
* MySQL
* `consle.table`
* `ASCII-art Logo`

## Installation

`npm install inquirer mysql console.table asciiart-logo`

## Additional Resources

* [MySQL Combine Two Columns Into One Column](https://stackoverflow.com/questions/22739841/mysql-combine-two-columns-into-one-column/22739860)
* [SQL Server Self Join](https://www.sqlservertutorial.net/sql-server-basics/sql-server-self-join/)
* [Remove Empty Array Elements](https://stackoverflow.com/questions/281264/remove-empty-elements-from-an-array-in-javascript#:~:text=For%20example%2C%20if%20you%20want,null%3B%20%7D)