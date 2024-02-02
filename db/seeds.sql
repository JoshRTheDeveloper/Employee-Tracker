
INSERT INTO department (name) VALUES 
    ('HR'),
    ('Engineering'),
    ('Marketing');

INSERT INTO role (title, salary, department_id) VALUES 
    ('HR Manager', 70000, 1),
    ('Software Engineer', 80000, 2),
    ('Marketing Specialist', 60000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
    ('John', 'Williams', 1, NULL),
    ('Harry', 'Smith', 2, 1),
    ('Bob', 'Johnson', 3, 1);