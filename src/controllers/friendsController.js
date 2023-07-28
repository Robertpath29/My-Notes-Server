const db = require(`../postgreSQL/db`);

class FriendsController {
    async addFriends(req, res) {
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
            `INSERT INTO friends (login, user_id) VALUES ($1, $2) RETURNING *`,
            [myLogin, friendId]
        );
        db.query(
            `INSERT INTO friends (login, user_id) VALUES ($1, $2) RETURNING *`,
            [friendLogin, myId]
        );

        res.json({ message: "friends ready" });
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
        const { myId, friendId, myLogin, friendLogin } = req.query;
        db.query(`DELETE FROM friends where login = $1 AND user_id = $2`, [
            myLogin,
            friendId,
        ]);
        db.query(`DELETE FROM friends where login = $1 AND user_id = $2`, [
            friendLogin,
            myId,
        ]);

        res.json({ message: "friends delete" });
    }
}

module.exports = new FriendsController();
