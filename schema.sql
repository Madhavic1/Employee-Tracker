### Schema
-- Drops the task_saver_db if it already exists --
DROP DATABASE IF EXISTS Employee_Tracker;
CREATE DATABASE Employee_Tracker;
USE Employee_Tracker;
 -- ---------------------------------------
CREATE TABLE employee (
    id INTEGER AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INTEGER,
    manager_id INTEGER,
    PRIMARY KEY (id),
    FOREIGN KEY(manager_id) REFERENCES employee(id) ON DELETE SET NULL,
    FOREIGN KEY(role_id) REFERENCES role(id) ON DELETE SET NULL
);

 -- Creating Role table
 CREATE TABLE role(
 id INTEGER AUTO_INCREMENT ,
 title VARCHAR(30),
 salary DECIMAL ,
 department_id INTEGER ,
 PRIMARY KEY(id),
 FOREIGN KEY(department_id) REFERENCES department(id) ON DELETE CASCADE
 );

  -- creating department table
 CREATE TABLE department (
 id INTEGER  AUTO_INCREMENT ,
 name varchar(30),
 primary key(id)
 );