const inquirer = require('inquirer');
const mysql = require('mysql'); //to connect to database and to perform queries.
const consoleTable = require('console.table');
// const express = require('express');
// const app = express();
 
// app.listen('3000',()=>{
//     console.log('Server Connected on port 3000');
// });

//connecting to database
var db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'Nani_0108$',
    database : 'Employee_Tracker'
});
//connect 
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('My SQL Connected ');
    start();
});

const start = async function () {
    //ask user what he would like to do ??

    const answers = await askUserChoice();
    console.log(answers.quetion);
    switch (answers.quetion) {
        case 'View All Employees':
            viewAllEmployees();
            db.end();
            break;

        case 'View All Departments':
            break;

        case 'View All Roles':
            break;

        case 'View All Employees by Department':
            break;

        case 'View All Employees by Manager':
            break;

        case 'View the total utilized budget of a department':
            break;

        case 'Add Employee':
            break;

        case 'Add Department':
            break;

        case 'Add Role':
            break;

        case 'Remove Employee':
            break;

        case 'Delete Department':
            break;

        case 'Delete Role':
            break;

        case 'Update Employee Role':
            break;

        case 'Update Employee Manager':
            break;

        case 'Exit':
            
            break;

        default:
            break;
    }
}

async function askUserChoice() {
    return await inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do ?',
            name: 'quetion',
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

function viewAllEmployees(){
//this function should show the employee data along with his department and role details
//  id      first_name      last_name    title    department      salary      manager
//-----     -----------    ---------     ------   -----------     -------    --------- 
    let sql = `select emp1.id as id,
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
db.query(sql,(err,result)=>{
    if(err) throw err;
    console.log('results are : ');
   // console.log(result);
   printTable(result);    
    
});
}
//prints the sql query result as a table to the console.
function printTable(result) {
    let arr = [];
    for (let i = 0; i < result.length; i++) {
        // console.log(result[i].first_name);
        var key;
        var item = {};
        for (key in result[i]) {
            item[key] = result[i][key];
        }
        arr.push(item);
    }
    console.log('My arr is below');
    console.log(arr);
    var table1 = consoleTable.getTable(arr);
    console.log(table1);
}
