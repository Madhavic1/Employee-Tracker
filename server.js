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

        case 'View All Employees by Manager':
            await viewEmployeesByManager();
            start();
            break;

        case 'View All Employees by Department':
            await viewEmployeesByDepartment();
            start();
            break;

        case 'View the total utilized budget of a department':
            await viewTheTotalUtilizedBudgetOfaDepartment();
            start();
            break;

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

        case 'Delete Department':
            await deleteDepartment();
            start();
            break;

        case 'Delete Role':
            await deleteRole();
            start();
            break;

        case 'Update Employee Manager':
            await updateEmployeeManager();
            start();
            break;

        case 'Update Employee Role':
            await updateEmployeeRole();
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
    let sql = `select distinct name as Department from department`;
    await readAndShow(sql);
}

async function viewAllRoles() {
    let sql = `select distinct title as Title from role`;
    await readAndShow(sql);
}

async function viewEmployeesByManager() {
    //give the list of all the managers
    let sql_manager_list = `select distinct A.id, concat(A.first_name,' ',A.last_name) as name 
                        from employee A inner join employee B 
                        on A.id = B.manager_id`;
    let data_managers = await accessDb.query(sql_manager_list);
    let managers = [];
    for (let i = 0; i < data_managers.length; i++) {
        managers.push(data_managers[i].name);
    }
    //ask the user to pick one manager
    const answer = await inquirer.prompt(
        [
            {
                type: 'list',
                message: "Which manager's employees do you want to view ?",
                name: 'manager',
                choices: managers
            }
        ]
    );
    //get the id of picked manager
    const managerId = await accessDb.query(`select id from employee where concat(employee.first_name,' ',employee.last_name)=?`, [answer.manager]);
    //show all the employees whose manager is the selected one above
    await readAndShow(`select * from employee where manager_id = ${managerId[0].id}`);
}

async function viewEmployeesByDepartment() {
    //prompt all the departments and ask user to pick one
    //show all the employees works for that depatment
    const dept_id = await queryDepartmentID();
    //get all the employees who works for the chosen department
    await readAndShow(`select * from employee where role_id in (select id from role where department_id = ${dept_id});`);
}

async function queryDepartmentID() {
    //gets all the department names from database department table
    let departments = await getAllDepartmentNames();
    //ask user which department he wants to choose
    const answer = await inquirer.prompt([
        {
            type: 'list',
            message: 'Which department do you want to choose?',
            name: 'department',
            choices: departments
        }
    ]);
    //get the department id for the department chosen by the user
    const dept_id = await accessDb.query(`select id from department where name=?`, [answer.department]);
    return dept_id[0].id;
}

//this function viewTheTotalUtilizedBudgetOfaDepartment() shows the combined salaries of all employees in that department
async function viewTheTotalUtilizedBudgetOfaDepartment() {
    const dept_id = await queryDepartmentID();
    let sql_salary_sum = `select sum(rol.salary) as sum from employee as emp
                      inner join 
                      role as rol
                      on emp.role_id = rol.id 
                      where emp.role_id in (select id from role where department_id =?)`;
    const salary_sum = await accessDb.query(sql_salary_sum, [dept_id]);
    if(salary_sum[0].sum === null )
    {
        console.log(`The total utilized budget of the selected department  is zero (0), as there are no employees under this department `);
    }
    console.log(`The total utilized budget of the selected department  is ${salary_sum[0].sum} `);
}

async function askUserChoice() {
    return await inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do ?',
            name: 'question',
            choices: [
                'View All Employees',
                'View All Departments',
                'View All Roles',
                'View All Employees by Department',
                'View All Employees by Manager',
                'View the total utilized budget of a department',
                'Add Employee',
                'Add Department',
                'Add Role',
                'Remove Employee',
                'Delete Department',
                'Delete Role',
                'Update Employee Role',
                'Update Employee Manager',
                'Exit'
            ]
        }
    ]);
}

async function addEmployee() {
    //get all the employee full names to give as a list to choose from , for manager
    let managers = await getAllEmployeesNames();
    //Adding 'None' option at index 0
    managers.splice(0, 0, 'None');
    //get all the roles
    let roles = await getAllRoles();
    //prompt user for entering employee's first name,last name, role(from the dropdown list) and manager name(from the dropdown list)
    const answers = await promtEmployeeDetails(managers, roles);
    let managerId;
    let m_id = null;
    if (answers.manager !== 'None') {
        managerId = await accessDb.query(`select id from employee where concat(employee.first_name,' ',employee.last_name)='${answers.manager}'`);
        m_id = managerId[0].id;
    }
    let roleId = await accessDb.query(`select id from role where title = '${answers.role}'`);
    let sql_insert = "INSERT INTO employee SET ?";
    let args = {
        first_name: answers.firstName,
        last_name: answers.lastName,
        role_id: roleId[0].id,
        manager_id: m_id
    }
    const result = await accessDb.query(sql_insert, args);
    console.log('Employee added Successfully !!');
}

async function getAllEmployeesNames() {
    const data_employees = await accessDb.query(`SELECT distinct concat(employee.first_name,' ',employee.last_name) as employee from employee`);
    let employees = [];
    for (let i = 0; i < data_employees.length; i++) {
        employees.push(data_employees[i].employee);
    }
    return employees;
}

async function addDepartment() {
    //prompt the user for new deparment name
    const answer = await inquirer.prompt([
        {
            type: 'input',
            message: 'What is the department name?',
            name: 'department',
            validate: function (val) {
                return validateValue(val,'department');
            }
        }
    ]);
    //check if the department already exists in the department table
    let count = await accessDb.query(`select count(*) as count from department where name = ?`, [answer.department]);
    if (count[0].count > 0) {
        console.log('The dapartment already exists !! try adding a different one.');
        return;
    }
    else {
        await accessDb.query("INSERT INTO department SET ?", { name: answer.department });
        console.log('Department added Successfully !!');
    }
}

async function addRole() {
    //get all department names from database
    let departments = await getAllDepartmentNames();
    //prompt the user for new deparment name
    const answers = await inquirer.prompt([
        {
            type: 'input',
            message: 'What is the Role title?',
            name: 'title',
            validate : function (val) {
                return validateTitle(val);
            }
        },
        {
            type: 'input',
            message: 'How much is the Salary?',
            name: 'salary',
            validate : function(val){
                return validateSalary(val);
            }
        },
        {
            type: 'list',
            message: 'What is the department this role belongs to ?',
            name: 'department',
            choices: departments
        }
    ]);
    let deptId = await accessDb.query(`select id from department where name =?`, [answers.department]);
    //check if the department already exists in the department table
    let count = await accessDb.query(`select count(*) as count from role  where title = ?`, [answers.title]);
    if (count[0].count > 0) {
        console.log('The Role already exists !! try adding a different one.');
        return;
    }
    else {
        let sql_insert_dept = "INSERT INTO role SET ?";
        let args = {
            title: answers.title,
            salary: answers.salary,
            department_id: deptId[0].id
        }
        await accessDb.query(sql_insert_dept, args);
        console.log(`Role : '${answers.title}' got added Successfully!!`);
    }
}

async function getAllDepartmentNames() {
    let departments = [];
    const data_departments = await accessDb.query(`SELECT DISTINCT name FROM department`);
    //looping through the departments array to get the names directly to display as a list
    for (let i = 0; i < data_departments.length; i++) {
        departments.push(data_departments[i].name);
    }
    return departments;
}

async function removeEmployee() {
    //get all the employee list from database
    let employees = await getAllEmployeesNames();
    //prompt user which employee he wants to remove from the list of employees provided as a list from database
    const answer = await inquirer.prompt(
        [
            {
                type: 'list',
                name: 'fullName',
                message: "Which employee do you want to remove?",
                choices: employees
            }
        ]
    );
    //handle the foreign key issue with manager_id with id column while deleting an employee
    const result = await accessDb.query(`DELETE FROM employee where concat(employee.first_name,' ',employee.last_name)=?`, [answer.fullName]);
    console.log(`Employee got removed Successfully!!`);
}

async function deleteDepartment() {
    let dept_id = await queryDepartmentID();
    await accessDb.query(`DELETE  FROM department where id = ?`, [dept_id]);
    console.log("The Department chosen was deleted successfully !!");
}

async function deleteRole() {
    let roles = await getAllRoles();
    const answer = await inquirer.prompt(
        [
            {
                type: 'list',
                name: 'role',
                message: 'Which role would you like to delete?',
                choices: roles
            }
        ]
    );
    const roleId = await accessDb.query(`select id from role where title = ?`, [answer.role]);
    await accessDb.query(`delete from role where id = ?`, [roleId[0].id]);
    console.log('Role got deleted successfully!!');
}

async function updateEmployeeManager() {
    //get all the employee full names 
    let employees = await getAllEmployeesNames();
    //ask question "Which employee's manager do you want to update?"
    const employee = await inquirer.prompt([
        {
            type: 'list',
            name: 'employee',
            message: "Which employee's manager do you want to update?",
            choices: employees
        }
    ]);
    let empId = await accessDb.query(`SELECT id FROM employee WHERE concat(employee.first_name,' ',employee.last_name) = ?`, [employee.employee]);
    let index = employees.indexOf(employee.employee);
    //remove the selected employee from the managers list
    employees.splice(index, 1);
    // "Which employee do you want to set as a manager for the selected employee?"
    const manager = await inquirer.prompt([
        {
            type: 'list',
            name: 'manager',
            message: "Which employee do you want to set as a manager for the selected employee?",
            choices: employees
        }
    ]);
    let managerId = await accessDb.query(`SELECT id FROM employee WHERE concat(employee.first_name,' ',employee.last_name) = ?`, [manager.manager]);
    //update employees manager in the database
    let args = [
        { manager_id: managerId[0].id },
        { id: empId[0].id }
    ]
    await accessDb.query(`UPDATE employee SET ? WHERE ?`, args);
    console.log("'Employee's manager is updated successfully!!'");
}

async function updateEmployeeRole() {
    //get all the employee full names 
    let employees = await getAllEmployeesNames();
    let roles = await getAllRoles();
    //ask question "Which employee's role do you want to update?"
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'employee',
            message: "Which employee's role do you want to update?",
            choices: employees
        },
        {
            type: 'list',
            name: 'role',
            message: "Which role do you want to update for the selected employee?",
            choices: roles
        }
    ]);
    let empId = await accessDb.query(`SELECT id FROM employee WHERE concat(employee.first_name,' ',employee.last_name) = ?`, [answers.employee]);
    let role_id = await accessDb.query(`select id from role where title = ?`, [answers.role]);
    let args = [
        { role_id: role_id[0].id },
        { id: empId[0].id }
    ]
    await accessDb.query(`UPDATE employee SET ? WHERE ?`, args);
    console.log('Employee"s role got updated successfully !!!');

}
async function getAllRoles() {
    const data_roles = await accessDb.query(`select distinct title from role`);
    let roles = [];
    for (let i = 0; i < data_roles.length; i++) {
        roles.push(data_roles[i].title);
    }
    return roles;
}

async function promtEmployeeDetails(managers, roles) {
    return await inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "What's the employee's First name?",
            validate: function (val) {
                return validateValue(val,'first');
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: "What's the employee's Last name?",
            validate: function (val) {
                return validateValue(val,'last');
            }
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

function validateValue(val,type) {
    var regName = /^[a-zA-Z1-9]+$/;
    var valid = regName.test(val);
    return valid || `Please Enter valid ${type} name!!`;
}
function validateTitle(val)
{
    var regName = /^([a-zA-Z0-9]+\s)*[a-zA-Z0-9]+$/;
    var valid = regName.test(val);
    return valid || `Please Enter valid role title!!`;
}
function validateSalary(val){
    var regNumbers = /^\d{1,6}(?:\.\d{0,2})?$/; //It actually means between 1 and six digits, followed by optionally a dot and a max of two digits.
    var valid = regNumbers.test(val);
    return valid || `Please Enter valid salary !!`;
}