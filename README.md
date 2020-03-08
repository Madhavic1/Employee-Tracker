# Employee-Tracker
A command-line application for managing a company's employees using node, and MySQL.

## table of contents

- Introduction / General Information
- Languages used
- Installation
- Launch
- Sources to read

### Introducion (Aim of the project) / General Information:

This is a Node CLI application, for creating a Content Management System that makes it easy for non-developers to view and interact with information stored in databases. 

Here in this application , the database schema contains 3 tables:
* department:
id - INT PRIMARY KEY
name - VARCHAR(30) to hold department name

* role:
id - INT PRIMARY KEY
title -  VARCHAR(30) to hold role title
salary -  DECIMAL to hold role salary
department_id -  INT to hold reference to department role belongs to

* employee:
id - INT PRIMARY KEY
first_name - VARCHAR(30) to hold employee first name
last_name - VARCHAR(30) to hold employee last name
role_id - INT to hold reference to role employee has
manager_id - INT to hold reference to another employee that manager of the current employee. This field may be null if the employee has no manager.

After launching this application , the user will be able to choose one option from the following list: 
    * 'View All Employees'
    * 'View All Departments'
    * 'View All Roles'
    * 'View All Employees by Department'
    * 'View All Employees by Manager'
    * 'View the total utilized budget of a department'
    * 'Add Employee'
    * 'Add Department'
    * 'Add Role'
    * 'Remove Employee'
    * 'Delete Department'
    * 'Delete Role'
    * 'Update Employee Role'
    * 'Update Employee Manager'

  ### Languages used:
  1. Node
  2. npm - Node package manager (below packages are installed from npm)
     - inquirer
     - console.table
     - mysql
  3. MySQL

### Installation:
    1. Prerequesite is to have Node.js installed on your computer
    2. Un-compress the file Employee-Tracker.zip
    3. Move the directory Employee-Tracker to a source directory(to keep the code away from regular documents)
    4. Open console and open the source directory path and install npm using 'npm install'.
    5. install all the npm packages by using the command 'npm install <package name>'

### Launch:
    Execute the command , node server.js, the application will ask the user what would he like to do , and does the appropriate action.

### Sources to read

    To get better knowledge of the languages used in this project , you can refer the below resources.
    * https://www.w3schools.com/
    * https://www.freecodecamp.org/
    * https://www.npmjs.com/
