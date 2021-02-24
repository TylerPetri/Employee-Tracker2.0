const inquirer = require('inquirer')
const mysql = require('mysql')
const cTable = require('console.table')
const db = require( './app/connection' )('homework','rootroot')

async function runSearch(){
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
                'View All Managers',
                'Add Manager',
                'Remove Manager',
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
            viewingByDepartment()
            break;
        case 'View All Employees By Manager':
            viewingByManager()
            break;
        case 'Add Employee':
            addEmployee()
            break;
        case 'Remove Employee':
            removeEmployee()
            break;
        case 'Update Employee Role':
            updateRole()
            break;
        case 'Update Employee Manager':
            updateManager()
            break;
        case 'View All Managers':
            viewManagers();
            break;
        case 'Add Manager':
            addManager()
            break;
        case 'Remove Manager':
            removeManager()
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
    db.query(query, (err, res) => {
        if (err) throw err;
        console.log(`\n`)
        console.table(res)
        runSearch()
    })
}
function viewRoles(){
    db.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;
        console.log(`\n`)
        console.table(res)
        runSearch()
    })
}
async function viewDepartments(){
    await db.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        console.log(`\n`)
        console.table(res)
        runSearch()
    })
}

async function viewManagers(){
    await db.query('SELECT * FROM manager', (err, res) => {
        if (err) throw err;
        console.log(`\n`)
        console.table(res)
        runSearch();
    })
}

async function viewingByDepartment(){
    const arr = []
    const data = await db.query('SELECT * FROM department')
        data.map(({department, id}) => {
            arr.push({name: department, value: id})
        })
        if(arr == []){
            console.log(`Empty list`)
            runSearch()
        } else {
        const answer = await inquirer.prompt([
            {
                message: 'Which department would you like to view?',
                type: 'list',
                choices: arr,
                name: 'department'
            }
        ])
        const d = await db.query(`SELECT e.first_name,e.last_name FROM employee AS e LEFT JOIN role AS r ON e.role_id = r.id LEFT JOIN department AS d ON r.department_id = d.id WHERE d.id = ${answer.department}`)
        console.table(d)
        runSearch();
    }
}

async function viewingByManager(){
    const arr = []
    const data = await db.query('SELECT * FROM manager')
        data.map(({manager,id}) => {
            arr.push({name:manager,value:id})
        })
        const answer = await inquirer.prompt([
            {
                message: 'Which manager list would you like to view?',
                type: 'list',
                choices: arr,
                name: 'manager'
            }
        ])
        const d = await db.query(`SELECT e.first_name,e.last_name FROM employee AS e WHERE e.manager_id = ${answer.manager}`)
        console.table(d)
        runSearch();
}

async function addEmployee(){
    let arr = []
    let a = []
    const data = await db.query('SELECT * FROM role')
    data.map(({title,id}) => {
            arr.push({name:title, value:id})
        })
    const d = await db.query('SELECT * FROM manager')
    d.map(({manager,id}) => {
            a.push({name:manager, value:id})
    })
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
            type: 'list',
            message: "What is the employee's role?",
            choices: arr,
            name: 'role',
        },
        {
            message: "Who is the employee's manager?",
            type: 'list',
            choices: a,
            name: 'manager'
        }
    ])
    await db.query('INSERT INTO employee VALUES(?,?,?,?,?)', [0,questions.firstName,questions.lastName,questions.role,questions.manager])
    viewEmployees();
    runSearch();
}

async function addRole(){
    const arr = []
    const data = await db.query('SELECT * FROM department')
        data.map(({department, id}) =>
            arr.push({name:department, value:id}))
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
            message: 'This role is assigned to which department?',
            type: 'list',
            choices: arr,
            name: 'id'
        }
    ])
    await db.query('INSERT INTO role VALUES(?,?,?,?)', [0,answer.title,answer.salary,answer.id])
    runSearch();
}

async function addDepartment(){
    const answer = await inquirer.prompt([
        {
            message: 'What is the name of the department?',
            name: 'name'
        }
    ])
    await db.query('INSERT INTO department VALUES(?,?)',[0,answer.name])
    runSearch();
}

async function addManager(){
    const answer = await inquirer.prompt([
        {
            message: "What is the full name of the manager?",
            name: 'name'
        }
    ])
    await db.query('INSERT INTO manager VALUES(?,?)',[0,answer.name])
    runSearch();
}

async function removeEmployee(){
    const arr = []
    const data = await db.query('SELECT first_name,last_name FROM employee')
        data.map(({first_name,last_name}) => {
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
        await db.query(`DELETE FROM employee WHERE first_name = '${b[0]}' AND last_name = '${b[1]}'`)
}

async function updateRole(){
    const arr = []
    const data = await db.query('SELECT * FROM employee')
        data.map(({first_name,last_name,id}) =>
            arr.push({name:`${first_name} ${last_name}`, value:id}))
    const a = []
    const d = await db.query('SELECT * FROM role')
        d.map(({title, id}) => {
            a.push({name:title,value:id})
        }) 

        if(a.length == 0){runSearch()} else {
            const answer = await inquirer.prompt([
                {
                    message: 'Which employee would you like to update?',
                    type: 'list',
                    choices: arr,
                    name: 'employee'
                },
                {
                    message: 'Which role would you like to assign?',
                    type: 'list',
                    choices: a,
                    name: 'newRole'
                }
            ])
            await db.query(`UPDATE employee SET role_id = ${answer.newRole} WHERE id = ${answer.employee}`)
            runSearch()
        }
}

async function updateManager(){
    const arr = []
    const data = await db.query('SELECT * FROM employee')
        data.map(({first_name,last_name,id}) =>
            arr.push({name:`${first_name} ${last_name}`, value:id}))
    const a = []
    const d = await db.query('SELECT * FROM manager')
        d.map(({manager, id}) => {
            a.push({name:manager,value:id})
        })   
            const answer = await inquirer.prompt([
                {
                    message: 'Which employee would you like to update?',
                    type: 'list',
                    choices: arr,
                    name: 'employee'
                },
                {
                    message: 'To which manager will this employee be assigned?',
                    type: 'list',
                    choices: a,
                    name: 'newManager'
                }
            ])
            await db.query(`UPDATE employee SET manager_id = ${answer.newManager} WHERE id = ${answer.employee}`)
            runSearch()
}

async function removeManager(){
    const arr = []
    const data = await db.query('SELECT * FROM manager')
        data.map(({manager,id}) => {
            arr.push({name:manager,value:id})
        })
        const answer = await inquirer.prompt([
            {
                message: 'Which manager would you like to remove?',
                type: 'list',
                choices: arr,
                name: 'id'
            }
        ])
        await db.query(`DELETE FROM manager WHERE id = '${answer.id}'`)
        runSearch();
}

async function removeRole(){
    const arr = []
    const data = await db.query('SELECT * FROM role')
        data.map(({title,id}) => {
            arr.push({name:title,value:id})
        })
        const answer = await inquirer.prompt([
            {
                message: 'Which role would you like to remove?',
                type: 'list',
                choices: arr,
                name: 'id'
            }
        ])
        await db.query(`DELETE FROM role WHERE id = '${answer.id}'`)
        runSearch();
}

async function removeDepartment(){
    const arr = []
    const data = await db.query('SELECT * FROM department')
        data.map(({department,id}) => {
            arr.push({name:department,value:id})
        })
        const answer = await inquirer.prompt([
            {
                message: 'Which department would you like to remove?',
                type: 'list',
                choices: arr,
                name: 'id'
            }
        ])
        await db.query(`DELETE FROM department WHERE id = '${answer.id}'`)
        await db.query(`DELETE FROM role WHERE department_id = '${answer.id}'`)
        runSearch();
}

runSearch()