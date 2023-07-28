const db = require(`../postgreSQL/db`);

class FriendsController {
    async addFriends(req, res) {
        const nameTableMessage = Date.now();
        const { myId, friendId, myLogin, friendLogin } = req.body;
        let repeatFriend = false;

        const myFriend = await db.query(
            `SELECT * FROM friends where user_id = $1`,
            [myId]
        );

        myFriend.rows.forEach((friend) => {
            if (friend.login === friendLogin) {
                repeatFriend = true;
                return;
            }
        });
        if (repeatFriend) {
            res.send({ message: "The user is your friend" });
            return;
        }
        db.query(
            `INSERT INTO friends (login, table_message_name, user_id) VALUES ($1, $2, $3) RETURNING *`,
            [myLogin, nameTableMessage, friendId]
        );
        db.query(
            `INSERT INTO friends (login, table_message_name, user_id) VALUES ($1, $2, $3) RETURNING *`,
            [friendLogin, nameTableMessage, myId]
        );

        db.query(
            `CREATE TABLE table_message_${nameTableMessage.toString()} (id SERIAL PRIMARY KEY, from_whom VARCHAR(255), whom VARCHAR(255), message TEXT, data VARCHAR(255))`
        );

        res.json({ message: "friends ready", nameTableMessage });
        try {
        } catch (error) {
            console.log(error.message);
        }
    }

    async getFriends(req, res) {
        try {
            const { user_id } = req.query;
            const friends = await db.query(
                `SELECT * FROM friends where user_id = $1`,
                [user_id]
            );
            res.json(friends.rows);
        } catch (error) {
            console.log(error.message);
        }
    }

    async deleteFriends(req, res) {
        const { myId, friendId, myLogin, friendLogin, nameTableMessage } =
            req.query;
        db.query(`DELETE FROM friends where login = $1 AND user_id = $2`, [
            myLogin,
            friendId,
        ]);
        db.query(`DELETE FROM friends where login = $1 AND user_id = $2`, [
            friendLogin,
            myId,
        ]);
        db.query(`DROP TABLE table_message_${nameTableMessage}`);

        res.json({ message: "friends delete" });
    }
}

module.exports = new FriendsController();
