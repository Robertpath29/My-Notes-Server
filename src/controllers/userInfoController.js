const db = require(`../postgreSQL/db`);
class UserInfoController {
    async createInfoUser(req, res) {
        try {
            const {
                name,
                surname,
                photo,
                birthday,
                country,
                city,
                address,
                user_id,
            } = req.body;

            const newInfoUser = await db.query(
                `INSERT INTO infoUser (name, surname, photo, birthday, country, city, address, user_id) VALUES ($1, $2, $3, $4 ,$5, $6, $7, $8) RETURNING *`,
                [
                    name,
                    surname,
                    photo,
                    birthday,
                    country,
                    city,
                    address,
                    user_id,
                ]
            );
            res.json(newInfoUser.rows[0]);
        } catch (error) {
            console.log(error);
        }
    }

    async getInfoUser(req, res) {
        const { id } = req.query;
        const posts = await db.query(
            `select * from InfoUser where user_id = $1`,
            [id]
        );
        res.json(posts.rows);
    }
}

module.exports = new UserInfoController();
