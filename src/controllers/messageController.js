const { json } = require("express");
const db = require("../mysql/db");

class MessageController {
    async getMessage(req, res) {
        try {
            const { nameTableMessage, numberMessage } = req.query;
            const filterArray = [];
            const [response] = await db
                .promise()
                .query(`SELECT * FROM table_message_${nameTableMessage}`);

            if (response) {
                let index = response.length - numberMessage;
                if (index < 0) {
                    res.json(response);
                    return;
                }
                for (index; index < response.length; index++) {
                    const res = response[index];
                    filterArray.push(res);
                }
            }
            res.json(filterArray);
        } catch (error) {
            console.log(error.message);
        }
    }

    async addMessage(req, res) {
        try {
            const { from_whom, whom, message, date, nameTableMessage } =
                req.body;
            const [online] = await db
                .promise()
                .query(`SELECT * FROM person where login = ?`, [whom]);
            if (!online[0].online) {
                await db
                    .promise()
                    .query(
                        `INSERT INTO table_unread_message_${whom.toLowerCase()} (name_friend) VALUES (?)`,
                        [from_whom]
                    );
            }
            const [response] = await db
                .promise()
                .query(
                    `INSERT INTO table_message_${nameTableMessage} (from_whom, whom, message, date) VALUES (?, ?, ?, ?)`,
                    [from_whom, whom, message, date]
                );
            res.json(response);
        } catch (error) {
            console.log(error.message);
        }
    }
}

module.exports = new MessageController();
