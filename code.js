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
                'Remove Role'],
            name: 'action'
        }
    ])

    switch (answer.action) {
        case 'View All Employees':
            viewEmployees();
            break;
        case 'View All Employees By Department':
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
            break;
        case 'Add Role':
            break;
        case 'Remove Role':
            break;
        default:
            console.log(`Invalid action: ${answer.action}`);
            break;
    }
}

const viewEmployees = () => {
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        res.forEach(({id,first_name,last_name,role_id,manager_id}) => {
            console.log(`${id} | ${first_name} | ${last_name} | ${role_id} | ${manager_id}`)
        })
    })
}

const addEmployee = async () => {
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