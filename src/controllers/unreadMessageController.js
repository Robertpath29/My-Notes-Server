const db = require("../mysql/db");

class UnreadMessageController {
    async getUnreadMessage(req, res) {
        try {
            const { login } = req.query;
            if (login) {
                const [response] = await db
                    .promise()
                    .query(
                        `SELECT * FROM table_unread_message_${login.toLowerCase()}`
                    );
                res.json(response);
                return;
            }
            res.json({ message: "no login" });
        } catch (error) {
            console.log(error.message);
        }
    }

    async addUnreadMessage(req, res) {
        try {
            const { whom, from_whom } = req.body;
            await db
                .promise()
                .query(
                    `INSERT INTO table_unread_message_${whom.toLowerCase()} (name_friend) VALUES (?)`,
                    [from_whom]
                );
            res.json({ message: `add table rows ${from_whom}` });
        } catch (error) {
            console.log(error.message);
        }
    }

    async deleteUnreadMessage(req, res) {
        try {
            const { whom, from_whom } = req.query;
            await db
                .promise()
                .query(
                    `DELETE FROM table_unread_message_${from_whom.toLowerCase()} WHERE name_friend = ?`,
                    [whom]
                );

            res.json({ message: `delete table rows ${whom}` });
        } catch (error) {
            console.log(error.message);
        }
    }
}

module.exports = new UnreadMessageController();
