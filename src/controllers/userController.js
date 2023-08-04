const db = require("../mysql/db");
const bcrypt = require("bcrypt");

class UserController {
    async createUser(req, res) {
        try {
            const { userName, email, password } = req.body;
            const [repeatUsername] = await db
                .promise()
                .query(`SELECT * FROM person WHERE login = ?`, [
                    userName.toLowerCase(),
                ]);
            const [repeatEmail] = await db
                .promise()
                .query(`SELECT * FROM person WHERE email = ?`, [email]);

            if (repeatUsername.length > 0)
                return res.json({
                    message: `A user with this login already exists`,
                    cancelRegister: true,
                });

            if (repeatEmail.length > 0)
                return res.json({
                    message: `A user with this email already exists`,
                    cancelRegister: true,
                });

            const hashPassword = bcrypt.hashSync(password, 7);
            await db
                .promise()
                .query(
                    `INSERT INTO person (login, email, password) VALUES (?, ?, ?)`,
                    [userName.toLowerCase(), email, hashPassword]
                );

            await db
                .promise()
                .query(
                    `CREATE TABLE table_unread_message_${userName.toLowerCase()} (id INT AUTO_INCREMENT PRIMARY KEY, name_friend VARCHAR(255))`
                );

            res.json({
                message: `You have successfully registered!`,
                userIsRegistered: true,
            });
        } catch (error) {
            console.log(error.message);
            res.json({ message: `error registration user (${error.message})` });
        }
    }

    async getLogInUser(req, res) {
        try {
            const { userName, password } = req.query;
            const [repeatUsername] = await db
                .promise()
                .query(`SELECT * FROM person WHERE login = ?`, [
                    userName.toLowerCase(),
                ]);

            if (repeatUsername.length === 0) {
                return res.json({
                    message: `The user with this login is not registered.`,
                    cancelRegister: true,
                });
            }

            const validPassword = bcrypt.compareSync(
                password,
                repeatUsername[0].password
            );
            if (!validPassword) {
                return res.json({
                    message: `Incorrect password entered`,
                    cancelRegister: true,
                });
            }

            res.json({
                user: repeatUsername[0],
                userIsLogIn: true,
            });
        } catch (error) {
            console.log(error.message);
            res.json({ message: `error log in user (${error.message})` });
        }
    }

    async getUser(req, res) {
        try {
            const { login } = req.query;
            const [user] = await db
                .promise()
                .query(`SELECT * FROM person WHERE login = ?`, [login]);
            res.json(user[0]);
        } catch (error) {
            console.log(error.message);
        }
    }
}

module.exports = new UserController();
