DROP DATABASE IF EXISTS homework;
CREATE DATABASE homework;

use homework;

CREATE TABLE department (
	id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    department VARCHAR(30)
);

CREATE TABLE role (
	id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    title VARCHAR(30),
    salary DECIMAL(10,4),
    department_id INT
);

CREATE TABLE employee (
	id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id int
);

CREATE TABLE manager (
	id INT PRIMARY KEY auto_increment NOT NULL,
    manager VARCHAR(30)
);

INSERT INTO manager values(0,'ashley balsic');
INSERT INTO employee VALUES(0,'Tyler','Petri','4','6');
INSERT INTO role VALUES(0,'Software Engineer',200000,'1');
INSERT INTO department VALUES(0,'Engineering');