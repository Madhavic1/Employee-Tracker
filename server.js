const inquirer = require('inquirer');
const mySql = require('mysql');
const Database = require('./Database');
const consoleTable = require('console.table');
const config = {
    host: 'localhost',
    user: 'root',
    password: 'Nani_0108$',
    database: 'Employee_Tracker'
};

//creates a connection object.
const database = mySql.createConnection(config);
const accessDb = new Database(database);

//connect to the Database
database.connect((err) => {
    if (err)
        throw err;
    console.log('Database connected ');
    start();
});
const start = async function () {
    //ask the user to choose what he wants to do 
    const answers = await askUserChoice();
    console.log(answers.question);
    switch (answers.question) {

        case 'View All Employees':
            await viewAllEmployees();
            start();
            break;

        case 'View All Departments':
            await viewAllDepartments();
            start();
            break;

        case 'View All Roles':
            await viewAllRoles();
            start();
            break;
// *********************************there are few more view questions need to be written ***********************************************************
        case 'Add Employee':
           await addEmployee();
            start();
            break;

        case 'Add Department':
          await addDepartment();
            start();
            break;

        case 'Add Role':
            await addRole();
            start();
            break;        

        case 'Remove Employee':
            await removeEmployee();
            start();
            break;

        case 'Exit':
            accessDb.close();
            break;

        default:
            break;
    }
};

async function readAndShow(sql) {
    const data = await accessDb.query(sql);
    var tableData = consoleTable.getTable(data);
    console.log(tableData);
}

async function viewAllEmployees() {
    let sql = `SELECT emp1.id as id,
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
            department as dept on role.department_id = dept.id`;
    await readAndShow(sql);
}

async function viewAllDepartments() {
    let sql = `select distinct name from department`;
    await readAndShow(sql);
}

async function viewAllRoles() {
    let sql = `select distinct title from role`;
    await readAndShow(sql);
}

async function askUserChoice() {
    return await inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do ?',
            name: 'question',
            choices: [
                'Remove Employee',
                'Exit',
                'View All Employees',
                'View All Departments',
                'View All Roles',
                'View All Employees by Department',
                'View All Employees by Manager',
                'View the total utilized budget of a department',
                'Add Employee',
                'Add Department',
                'Add Role',
                'Delete Department',
                'Delete Role',
                'Update Employee Role',
                'Update Employee Manager',
                
            ]
        }
    ]);
}

async function addEmployee() {
    
    //get all the employee full names to give as a list to choose from , for manager
    let managers = await getAllEmployeesNames();
    //Adding 'None' option at index 0
    managers.splice(0,0,'None');

    //get all the roles
    let roles = [];
    let sql_roles = `select distinct title from role`;
    const data_roles = await accessDb.query(sql_roles);
    for (let i = 0; i < data_roles.length; i++) {
        roles.push(data_roles[i].title);
    }
    //prompt user for entering employee's first name,last name, role(from the dropdown list) and manager name(from the dropdown list)
    const answers = await promtEmployeeDetails(managers,roles);
    let managerId;
    let m_id = null;
    if (answers.manager !== 'None') {
        let sql_managerId = `select id from employee where concat(employee.first_name,' ',employee.last_name)='${answers.manager}'`;
        managerId = await accessDb.query(sql_managerId);
        m_id = managerId[0].id;
    }
    let sql_roleId = `select id from role where title = '${answers.role}'`;
    let roleId = await accessDb.query(sql_roleId);
    let sql_insert = "INSERT INTO employee SET ?";
    let args = {
        first_name: answers.firstName,
        last_name: answers.lastName,
        role_id: roleId[0].id,
        manager_id: m_id
    }
    const result = await accessDb.query(sql_insert, args);

}

async function getAllEmployeesNames() {
    let sql_employees = `SELECT distinct concat(employee.first_name,' ',employee.last_name) as employee from employee`;
    const data_employees = await accessDb.query(sql_employees);
    let employees = [];
    for (let i = 0; i < data_employees.length; i++) {
        employees.push(data_employees[i].employee);
    }
    return employees;
}

async function addDepartment(){
    //prompt the user for new deparment name
    const answer = await inquirer.prompt([
        {
            type : 'input',
            message : 'What is the department name?',
            name : 'department'
        }
    ]);
    //check if the department already exists in the department table
    let sql_read_department = `select count(*) as count from department where name = ?`;
    let count = await accessDb.query(sql_read_department,[answer.department]);
    console.log(count[0].count);
    if(count[0].count>0)
    {
        console.log('The dapartment already exists !! try adding a different one.');
        return;
    }
    else
    {
        let sql_insert_dept = "INSERT INTO department SET ?";
        let args = {
            name : answer.department
        }

        await accessDb.query(sql_insert_dept,args);
    }
}

async function addRole(){
    let departments = [];
    //get all department names from database
    const data_departments = await accessDb.query(`SELECT DISTINCT name FROM department`);
    //looping through the departments array to get the names directly to display as a list
    for (let i = 0; i < data_departments.length; i++) {
        departments.push(data_departments[i].name);
    }
    //prompt the user for new deparment name
    const answers = await inquirer.prompt([
        {
            type : 'input',
            message : 'What is the Role title?',
            name : 'title'
        },
        {
            type : 'number',
            message : 'How much is the Salary?',
            name : 'salary'
        },
        {
            type : 'list',
            message : 'What is the department this role belongs to ?',
            name : 'department',
            choices : departments
        }
    ]);
    let sql_dept_id = `select id from department where name =?`;
    let deptId = await accessDb.query(sql_dept_id,[answers.department]);
    //check if the department already exists in the department table
    let sql_read_role = `select count(*) as count from role  where title = ?`;
    let count = await accessDb.query(sql_read_role,[answers.title]);
    if(count[0].count>0)
    {
        console.log('The Role already exists !! try adding a different one.');
        return;
    }
    else
    {
        let sql_insert_dept = "INSERT INTO role SET ?";
        let args = {
            title : answers.title,
            salary : answers.salary,
            department_id : deptId[0].id
        }
        await accessDb.query(sql_insert_dept,args);
        console.log(`Role : '${answers.title}' got added Successfully!!`);
        
    }
}

async function removeEmployee(){
    //get all the employee list from database
      let employees  =   await getAllEmployeesNames();
    //prompt user which employee he wants to remove from the list of employees provided as a list from database
    const answer =await  inquirer.prompt(
        [
            {
                type: 'list',
                name: 'fullName',
                message: "Which employee do you want to remove?",
                choices : employees
            }
        ]
        );
console.log(answer.fullName);
//handle the foreign key issue with manager_id with id column while deleting an employee
        let sql_delete = `DELETE FROM employee where concat(employee.first_name,' ',employee.last_name)=?`;
        let args = [answer.fullName];
        const result = await accessDb.query(sql_delete,args);
        console.log(result);
        
}

async function promtEmployeeDetails(managers,roles) {
    return await inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "What's the employee's First name?"
        },
        {
            type: 'input',
            name: 'lastName',
            message: "What's the employee's Last name?"
        },
        {
            type: 'list',
            name: 'role',
            message: "What's the employee's role?",
            choices: roles
        },
        {
            type: 'list',
            name: 'manager',
            message: "Who's the employee's manager?",
            choices: managers
        }
    ]);
}

