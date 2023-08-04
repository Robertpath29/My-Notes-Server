const db = require("../mysql/db");
const path = require("path");
const fs = require("fs").promises;

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
                await img.mv(filePath);
            }

            const [newInfoUser] = await db
                .promise()
                .query(
                    `INSERT INTO infoUser (name, surname, photo, birthday, country, city, address, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
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
            res.json(newInfoUser);
        } catch (error) {
            console.log(error);
        }
    }

    async getInfoUser(req, res) {
        try {
            const { id } = req.query;
            const [posts] = await db
                .promise()
                .query(`SELECT * FROM infoUser WHERE user_id = ?`, [id]);
            res.json(posts);
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
                await fs.unlink(
                    path.resolve(
                        __dirname,
                        "..",
                        "..",
                        "assets",
                        "userIcon",
                        json.photo
                    )
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
                await img.mv(filePath);
            }
            const [updateInfoUser] = await db
                .promise()
                .query(
                    `UPDATE infoUser SET name = ?, surname = ?, photo = ?, birthday = ?, country = ?, city = ?, address = ? WHERE id = ?`,
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
            res.json(updateInfoUser);
        } catch (error) {
            console.log(error.message);
        }
    }
}

module.exports = new UserInfoController();
