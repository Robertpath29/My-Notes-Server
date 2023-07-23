CREATE TABLE person (
    id SERIAL PRIMARY KEY,
    login VARCHAR(255),
    email VARCHAR(255),
    online: BOOLEAN DEFAULT false,
    password VARCHAR(255)
);

CREATE TABLE infoUser(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    surname VARCHAR(255),
    photo VARCHAR(255),
    birthday VARCHAR(255),
    country VARCHAR(255),
    city VARCHAR(255),
    address VARCHAR(255),
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES person(id)
);
CREATE TABLE notes(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    textarea TEXT,
    color VARCHAR(255),
    done BOOLEAN DEFAULT false,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES person(id)
);
CREATE TABLE friends(
    id SERIAL PRIMARY KEY,
    login VARCHAR(255),
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES person(id)
);


