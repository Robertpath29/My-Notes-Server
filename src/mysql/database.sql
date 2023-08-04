CREATE TABLE person (
    id INT AUTO_INCREMENT PRIMARY KEY,
    login VARCHAR(255),
    email VARCHAR(255),
    online BOOLEAN DEFAULT false,
    password VARCHAR(255)
);

CREATE TABLE infoUser(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    surname VARCHAR(255),
    photo VARCHAR(255),
    birthday VARCHAR(255),
    country VARCHAR(255),
    city VARCHAR(255),
    address VARCHAR(255),
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES person(id)
);

CREATE TABLE notes(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    textarea TEXT,
    color VARCHAR(255),
    done BOOLEAN DEFAULT false,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES person(id)
);

CREATE TABLE friends(
    id INT AUTO_INCREMENT PRIMARY KEY,
    login VARCHAR(255),
    table_message_name VARCHAR(255),
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES person(id)
);
