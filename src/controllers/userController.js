const db = require(`../postgreSQL/db`);
const bcrypt = require(`bcrypt`);
class UserController {
    async createUser(req, res) {
        try {
            const { userName, email, password } = req.body;
            const repeatUsername = await db.query(
                `SELECT * FROM person where login = $1`,
                [userName.toLowerCase()]
            );
            const repeatEmail = await db.query(
                `SELECT * FROM person where email = $1`,
                [email]
            );
            if (repeatUsername.rows.length > 0)
                return res.json({
                    message: `A user with this login already exists`,
                    cancelRegister: true,
                });
            if (repeatEmail.rows.length > 0)
                return res.json({
                    message: `A user with this email already exists`,
                    cancelRegister: true,
                });
            const hashPassword = bcrypt.hashSync(password, 7);
            db.query(
                `INSERT INTO person (login, email, password) VALUES ($1, $2, $3) RETURNING *`,
                [userName.toLowerCase(), email, hashPassword]
            );
            db.query(
                `CREATE TABLE table_unread_message_${userName.toLowerCase()} (id SERIAL PRIMARY KEY, name_friend VARCHAR(255))`
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
            const repeatUsername = await db.query(
                `SELECT * FROM person where login = $1`,
                [userName.toLowerCase()]
            );
            if (repeatUsername.rows.length === 0) {
                return res.json({
                    message: `The user with this login is not registered.`,
                    cancelRegister: true,
                });
            }

            const validPassword = bcrypt.compareSync(
                password,
                repeatUsername.rows[0].password
            );
            if (!validPassword) {
                return res.json({
                    message: `Incorrect password entered`,
                    cancelRegister: true,
                });
            }

            res.json({
                user: repeatUsername.rows[0],
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
            const user = await db.query(
                `SELECT * FROM person where login = $1`,
                [login]
            );
            res.json(user.rows[0]);
        } catch (error) {
            console.log(error.message);
        }
    }
}
module.exports = new UserController();
