CREATE DATABASE Employee_Tracker;
USE EMPLOYEE_TRACKER;
 -- ---------------------------------------
CREATE TABLE employee (
    id INTEGER AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INTEGER,
    manager_id INTEGER,
    PRIMARY KEY (id)
);
 select * from employee;
 insert into employee (first_name,last_name,role_id) values ('John','Doe',1);
 insert into employee (first_name,last_name,role_id) values ('Mike','Chan',2);
 insert into employee (first_name,last_name,role_id) values ('Ashley','Rodriguez',3);
 insert into employee (first_name,last_name,role_id) values ('Kevin','Tupik',4);
 insert into employee (first_name,last_name,role_id) values ('Malia','Brown',5);
 insert into employee (first_name,last_name,role_id) values ('Sarah','Lourd',6);
 insert into employee (first_name,last_name,role_id) values ('Tom','Allen',7);
 insert into employee (first_name,last_name,role_id) values ('Tammer','Galal',2);

ALTER TABLE employee  
ADD FOREIGN KEY(manager_id) REFERENCES employee(id);
 ALTER TABLE employee 
 ADD FOREIGN KEY(role_id) REFERENCES role(id);
 DESC employee;
  -- ---------------------------------------
 -- Creating Role table
 CREATE TABLE role(
 id INTEGER AUTO_INCREMENT ,
 title VARCHAR(30),
 salary DECIMAL ,
 department_id INTEGER ,
 PRIMARY KEY(id)
 );
INSERT INTO ROLE (title,salary,department_id)
 VALUES ('Sales Lead','1000','15'),
		('SalesPerson','500','15'),
        ('Lead Engineer','8000','22'),
        ('Software Engineer','5000','22'),
        ('Accountant','1000','17'),
        ('Legal Team Lead','10000','18'),
        ('Lawyer','5000','18');
INSERT into ROLE (title,salary,department_id) values ('Sales Manager',3000,15);
UPDATE ROLE set salary =1000 , department_id=15 where id =1; 
UPDATE ROLE set salary =500 , department_id=15 where id =2; 
UPDATE ROLE set salary =8000 , department_id=22 where id =3; 
UPDATE ROLE set salary =5000 , department_id=22 where id =4; 
UPDATE ROLE set salary =10000 , department_id=18 where id =6; 
UPDATE ROLE set salary =5000 , department_id=18 where id =7; 
UPDATE ROLE set salary =3000 , department_id=15 where id =8; 

 select * from role;
ALTER TABLE role 
ADD FOREIGN KEY(department_id) REFERENCES department(id);

 DESC role;
  -- ---------------------------------------
 -- creating department table
 CREATE TABLE department (
 id INTEGER  AUTO_INCREMENT ,
 name varchar(30),
 primary key(id)
 );
insert into department (name) values ('sales'),('Engineering'),('Accounts'),('Legal'),('Lawyer'),('research'),('operations');
insert into department (name) values ('Software');
select * from department;
delete from department where id=2;
delete from department where id=3;
delete from department where id=4;
delete from department where id=5;
delete from department where id=6;
delete from department where id=7;
delete from department where id=8;
delete from department where id=9;
delete from department where id=10;
delete from department where id=11;
delete from department where id=12;
delete from department where id=13;
delete from department where id=14;
select * from role;
select * from department;
select * from employee;
--  inner join between employee and role tables
select * from employee INNER JOIN role on employee.role_id = role.id INNER JOIN department on role.department_id = department.id where employee.id between 4 and 11;

update employee set manager_id = 8 where id = 11;

select emp1.id as id,
                  emp1.first_name,
                  emp1.last_name,
                  role.title,
                  dept.name as department,
                  role.salary ,
				  concat(emp2.first_name,'  ',emp2.last_name) as manager
            from employee as emp1 
            LEFT JOIN 
            employee as emp2 on emp1.manager_id = emp2.id
            INNER JOIN 
            role on emp1.role_id = role.id 
            INNER JOIN 
            department as dept on role.department_id = dept.id;
select e1.id,
	   e1.first_name, 
       e1.last_name , 
       e1.role_id, 
       e2.first_name as manager
	from employee e1 left JOIN 
    employee e2 on e1.manager_id = e2.id;
    
    select *  from employee;
    select * from role ;
    --  where id between 9 and 16;
    select * from department ;-- where id between 23 and 30;
    DELETE FROM role 
WHERE
    id BETWEEN 9 AND 16;
    
    