const db = require(`../postgreSQL/db`);
const path = require(`path`);
const fs = require("fs");
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

    async editInfoUser(req, res) {
        try {
            const { data } = req.body;
            const json = JSON.parse(data);
            let photo = json.photo;
            if (req.files) {
                fs.rm(
                    path.resolve(
                        __dirname,
                        `..`,
                        `..`,
                        `assets`,
                        `userIcon`,
                        json.photo
                    ),
                    () => {
                        console.log(`Photo ${json.photo} is delete`);
                    }
                );
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
            const updateInfoUser = await db.query(
                `UPDATE infoUser set name = $1, surname = $2, photo = $3, birthday = $4, country = $5, city = $6, address = $7 where id = $8 RETURNING *`,
                [
                    json.name,
                    json.surname,
                    photo,
                    json.birthday,
                    json.country,
                    json.city,
                    json.address,
                    json.infoUser_id,
                ]
            );
            res.json(updateInfoUser.rows[0]);
        } catch (error) {
            console.log(error.message);
        }
    }
}

module.exports = new UserInfoController();
