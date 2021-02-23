const inquirer = require('inquirer')
const mysql = require('mysql')

const connection = mysql.createConnection({
    host:'localhost',
    port: 3306,
    user: 'root',
    password: 'rootroot',
    database: 'homework'
})

connection.connect((err) => {
    if (err) throw err;
    runSearch();
})

const runSearch = async () => {
    const answer = await inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View All Employees',
                'View All Employees By Department',
                'View All Employees By Manager',
                'Add Employee',
                'Remove Employee',
                'Update Employee Role',
                'Update Employee Manager',
                'View All Roles',
                'Add Role',
                'Remove Role',
                'View All Departments',
                'Add Department',
                'Remove Department'],
            name: 'action'
        }
    ])

    switch (answer.action) {
        case 'View All Employees':
            viewEmployees();
            break;
        case 'View All Employees By Department':
            employeeByDepartment()
            break;
        case 'View All Employees By Manager':
            break;
        case 'Add Employee':
            addEmployee()
            break;
        case 'Remove Employee':
            break;
        case 'Update Employee Role':
            break;
        case 'Update Employee Manager':
            break;
        case 'View All Roles':
            viewRoles()
            break;
        case 'Add Role':
            addRole()
            break;
        case 'Remove Role':
            break;
        case 'View All Departments':
            viewDepartments()
            break;
        case 'Add Department':
            addDepartment()
            break;
        case 'Remove Department':
            break;
        default:
            console.log(`Invalid action: ${answer.action}`);
            break;
    }
}

function viewEmployees(){
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        res.forEach(({id,first_name,last_name,role_id,manager_id}) => {
            console.log(`${id} | ${first_name} | ${last_name} | ${role_id} | ${manager_id}`)
        })
    })
}
function viewRoles(){
    connection.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;
        res.forEach(({id,title,salary,department_id}) => {
            console.log(`${id} | ${title} | ${salary} | ${department_id}`)
        })
    })
}
function viewDepartments(){
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        res.forEach(({id,name}) => {
            console.log(`${id} | ${name}`)
        })
    })
}

async function addEmployee(){
    const questions = await inquirer.prompt([
        {
            message: "What is the employee's first name?",
            name: 'firstName'
        },
        {
            message: "What is the employee's last name?",
            name: 'lastName'
        },
        {
            message: "What is the employee's role?",
            name: 'role'
        },
        {
            message: "Who is the employee's manager?",
            type: 'list',
            choices: ['1'],
            name: 'manager'
        }
    ])
    connection.query('INSERT INTO employee VALUES(?,?,?,?,?)', [0,questions.firstName,questions.lastName,questions.role,questions.manager])
    viewEmployees();
}

async function addRole(){
    const answer = await inquirer.prompt([
        {
            message: 'What is the title of the role?',
            name: 'title'
        },
        {
            message: 'What is the salary of the role?',
            name: 'salary'
        },
        {
            message: 'What is the department id?',
            name: 'id'
        }
    ])
    connection.query('INSERT INTO role VALUES(?,?,?,?)', [0,answer.title,answer.salary,answer.id])
}

async function addDepartment(){
    const answer = await inquirer.prompt([
        {
            message: 'What is the name of the department?',
            name: 'name'
        }
    ])
    connection.query('INSERT INTO department VALUES(?,?)',[0,answer.name])
}

function employeeByDepartment(){
    const arr = []
    connection.query('SELECT first_name,last_name FROM employee', async (err, res) => {
        res.forEach(({first_name,last_name}) => {
            arr.push(`${first_name} ${last_name}`)
        })
        const answer = await inquirer.prompt([
            {
                message: 'Which employee?',
                type: 'list',
                choices: arr,
                name: 'name'
            }
        ])
    })
}