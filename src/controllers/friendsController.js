const db = require("../mysql/db");

class FriendsController {
    async addFriends(req, res) {
        try {
            const nameTableMessage = Date.now().toString();
            const { myId, friendId, myLogin, friendLogin } = req.body;
            let repeatFriend = false;

            const [myFriend] = await db
                .promise()
                .query(`SELECT * FROM friends WHERE user_id = ?`, [myId]);

            myFriend.forEach((friend) => {
                if (friend.login === friendLogin) {
                    repeatFriend = true;
                    return;
                }
            });

            if (repeatFriend) {
                res.send({ message: "The user is your friend" });
                return;
            }

            await db
                .promise()
                .query(
                    `INSERT INTO friends (login, table_message_name, user_id) VALUES (?, ?, ?)`,
                    [myLogin, nameTableMessage, friendId]
                );

            await db
                .promise()
                .query(
                    `INSERT INTO friends (login, table_message_name, user_id) VALUES (?, ?, ?)`,
                    [friendLogin, nameTableMessage, myId]
                );

            await db
                .promise()
                .query(
                    `CREATE TABLE table_message_${nameTableMessage} (id INT AUTO_INCREMENT PRIMARY KEY, from_whom VARCHAR(255), whom VARCHAR(255), message TEXT, date VARCHAR(255))`
                );

            res.json({ message: "friends ready", nameTableMessage });
        } catch (error) {
            console.log(error.message);
        }
    }

    async getFriends(req, res) {
        try {
            const { user_id } = req.query;
            const [friends] = await db
                .promise()
                .query(`SELECT * FROM friends WHERE user_id = ?`, [user_id]);
            res.json(friends);
        } catch (error) {
            console.log(error.message);
        }
    }

    async deleteFriends(req, res) {
        try {
            const { myId, friendId, myLogin, friendLogin, nameTableMessage } =
                req.query;
            await db
                .promise()
                .query(`DELETE FROM friends WHERE login = ? AND user_id = ?`, [
                    myLogin,
                    friendId,
                ]);
            await db
                .promise()
                .query(`DELETE FROM friends WHERE login = ? AND user_id = ?`, [
                    friendLogin,
                    myId,
                ]);
            await db
                .promise()
                .query(`DROP TABLE table_message_${nameTableMessage}`);

            res.json({ message: "friends delete" });
        } catch (error) {
            console.log(error.message);
        }
    }
}

module.exports = new FriendsController();
