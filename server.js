const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'yourpassword',
  database: 'employee_management'
});


function connectDB() {
  db.connect(err => {
    if (err) throw err;
    console.log('Connected to the database.');
    startApp();
  });
}


function startApp() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
          'Exit'
        ]
      }
    ])
    .then(answer => {
      switch (answer.action) {
        case 'View all departments':
          viewDepartments();
          break;
        case 'View all roles':
          viewRoles();
          break;
        case 'View all employees':
          viewEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee role':
          updateEmployeeRole();
          break;
        case 'Exit':
          console.log('Exiting the application.');
          db.end();
          break;
      }
    });
}

function viewDepartments() {
  db.query('SELECT * FROM department', (err, results) => {
    if (err) throw err;
    console.table(results);
    startApp();
  });
}


function viewRoles() {
  db.query('SELECT * FROM role', (err, results) => {
    if (err) throw err;
    console.table(results);
    startApp();
  });
}

function viewEmployees() {
  const query =
    'SELECT ' +
    'employee.id, ' +
    'employee.first_name, ' +
    'employee.last_name, ' +
    'role.title AS role, ' +
    'department.name AS department, ' +
    'role.salary, ' +
    'CONCAT(manager.first_name, " ", manager.last_name) AS manager ' +
    'FROM ' +
    'employee ' +
    'LEFT JOIN role ON employee.role_id = role.id ' +
    'LEFT JOIN department ON role.department_id = department.id ' +
    'LEFT JOIN employee manager ON employee.manager_id = manager.id';
  
  db.query(query, (err, results) => {
    if (err) throw err;
    console.table(results);
    startApp();
  });
}




function addDepartment() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter the name of the department:'
      }
    ])
    .then(answer => {
      const query = 'INSERT INTO department SET ?';
      db.query(query, { name: answer.name }, (err, results) => {
        if (err) throw err;
        console.log(`Department "${answer.name}" added to the database.`);
        startApp();
      });
    });
}

function addRole() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter the title of the role:'
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Enter the salary for this role:'
      },
      {
        type: 'input',
        name: 'department_id',
        message: 'Enter the department id for this role:'
      }
    ])
    .then(answer => {
      const query = 'INSERT INTO role SET ?';
      db.query(query, { title: answer.title, salary: answer.salary, department_id: answer.department_id }, (err, results) => {
        if (err) throw err;
        console.log(`Role "${answer.title}" added to the database.`);
        startApp();
      });
    });
}



// Modified addEmployee function
function addEmployee() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'first_name',
        message: 'Enter the first name of the employee:'
      },
      {
        type: 'input',
        name: 'last_name',
        message: 'Enter the last name of the employee:'
      },
      {
        type: 'input',
        name: 'role_id',
        message: 'Enter the role id for this employee:'
      },
      {
        type: 'input',
        name: 'manager_id',
        message: 'Enter the manager id for this employee:'
      }
    ])
    .then(answer => {
      const query = 'INSERT INTO employee SET ?';
      db.query(query, { first_name: answer.first_name, last_name: answer.last_name, role_id: answer.role_id, manager_id: answer.manager_id }, (err, results) => {
        if (err) throw err;
        console.log(`Employee "${answer.first_name} ${answer.last_name}" added to the database with role id ${answer.role_id}.`);
        startApp();
      });
    });
}

function updateEmployeeRole() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'employee_id',
        message: 'Enter the id of the employee you want to update:'
      },
      {
        type: 'input',
        name: 'new_role_title',
        message: 'Enter the new role title for this employee:'
      }
    ])
    .then(answer => {
      const query = 'UPDATE employee SET role_id = (SELECT id FROM role WHERE title = ?) WHERE id = ?';
      db.query(query, [answer.new_role_title, answer.employee_id], (err, results) => {
        if (err) throw err;
        console.log(`Employee with id ${answer.employee_id} updated to new role title "${answer.new_role_title}".`);
        startApp();
      });
    });
}


connectDB();
