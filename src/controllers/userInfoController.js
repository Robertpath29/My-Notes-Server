const { log } = require("console");
const db = require(`../postgreSQL/db`);
const path = require(`path`);
class UserInfoController {
    async createInfoUser(req, res) {
        try {
            const { data } = req.body;
            const json = JSON.parse(data);
            let photo = "";
            if (req.files) {
                const img = req.files.img;
                const fileName = Date.now() + img.name.slice(-5);
                const filePath = path.resolve(
                    __dirname,
                    "..",
                    "..",
                    "assets",
                    "userIcon",
                    fileName
                );
                photo = fileName;
                req.files.img.mv(filePath);
            }

            const newInfoUser = await db.query(
                `INSERT INTO infoUser (name, surname, photo, birthday, country, city, address, user_id) VALUES ($1, $2, $3, $4 ,$5, $6, $7, $8) RETURNING *`,
                [
                    json.name,
                    json.surname,
                    photo,
                    json.birthday,
                    json.country,
                    json.city,
                    json.address,
                    json.user_id,
                ]
            );
            res.json(newInfoUser.rows[0]);
        } catch (error) {
            console.log(error);
        }
    }

    async getInfoUser(req, res) {
        try {
            const { id } = req.query;
            const posts = await db.query(
                `select * from InfoUser where user_id = $1`,
                [id]
            );
            res.json(posts.rows);
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new UserInfoController();
