const inquirer = require('inquirer')
const mysql = require('mysql')
const cTable = require('console.table')

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
            // viewingByDepartment()
            break;
        case 'View All Employees By Manager':
            break;
        case 'Add Employee':
            addEmployee()
            break;
        case 'Remove Employee':
            removeEmployee()
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
            removeRole()
            break;
        case 'View All Departments':
            viewDepartments()
            break;
        case 'Add Department':
            addDepartment()
            break;
        case 'Remove Department':
            removeDepartment()
            break;
        default:
            console.log(`Invalid action: ${answer.action}`);
            break;
    }
}

function viewEmployees(){
    const query = `SELECT e.id,e.first_name,e.last_name,r.title,d.department,r.salary,m.manager FROM employee AS e LEFT JOIN role AS r ON e.role_id = r.id LEFT JOIN department AS d ON r.department_id = d.id LEFT JOIN manager AS m ON e.manager_id = m.id`
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log(`\n`)
        console.table(res)
        runSearch()
    })
}
function viewRoles(){
    connection.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;
        console.log(`\n`)
        console.table(res)
        runSearch()
    })
}
async function viewDepartments(){
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        console.log(`\n`)
        console.table(res)
        runSearch()
    })
}

function viewingByDepartment(){
    const arr = []
    connection.query('SELECT department.department FROM department', async (err, res) => {
        res.forEach(({department}) => {
            arr.push(`${department}`)
        })
        const answer = await inquirer.prompt([
            {
                message: 'Which department would you like to view?',
                type: 'list',
                choices: arr,
                name: 'department'
            }
        ])
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

function removeEmployee(){
    const arr = []
    connection.query('SELECT first_name,last_name FROM employee', async (err, res) => {
        res.forEach(({first_name,last_name}) => {
            arr.push(`${first_name} ${last_name}`)
        })
        const answer = await inquirer.prompt([
            {
                message: 'Which employee would you like to remove?',
                type: 'list',
                choices: arr,
                name: 'name'
            }
        ])
        let a = answer.name
        let b = a.split(" ")
        connection.query(`DELETE FROM employee WHERE first_name = '${b[0]}' AND last_name = '${b[1]}'`)
    })
}

function removeRole(){
    const arr = []
    connection.query('SELECT title FROM role', async (err, res) => {
        res.forEach(({title}) => {
            arr.push(`${title}`)
        })
        const answer = await inquirer.prompt([
            {
                message: 'Which role would you like to remove?',
                type: 'list',
                choices: arr,
                name: 'name'
            }
        ])
        connection.query(`DELETE FROM role WHERE title = '${answer.name}'`)
    })
}

function removeDepartment(){
    const arr = []
    connection.query('SELECT name FROM department', async (err, res) => {
        res.forEach(({name}) => {
            arr.push(`${name}`)
        })
        const answer = await inquirer.prompt([
            {
                message: 'Which department would you like to remove?',
                type: 'list',
                choices: arr,
                name: 'name'
            }
        ])
        connection.query(`DELETE FROM department WHERE name = '${answer.name}'`)
    })
}