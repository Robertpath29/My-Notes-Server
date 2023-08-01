const db = require(`../postgreSQL/db`);
class MessageController {
    async getMessage(req, res) {
        try {
            const { nameTableMessage } = req.query;
            const response = await db.query(`
            SELECT * FROM table_message_${nameTableMessage}
            `);
            res.json(response.rows);
        } catch (error) {
            console.log(error.message);
        }
    }
    async addMessage(req, res) {
        try {
            const { from_whom, whom, message, date, nameTableMessage } =
                req.body;
            const online = await db.query(
                `
                SELECT * FROM person where login = $1
                `,
                [whom]
            );
            if (!online.rows[0].online) {
                db.query(
                    `
                INSERT INTO table_unread_message_${whom.toLowerCase()} (name_friend) VALUES ($1) RETURNING *`,
                    [from_whom]
                );
            }
            const response = await db.query(
                `INSERT INTO table_message_${nameTableMessage} (from_whom, whom, message, date) VALUES ($1, $2, $3, $4) RETURNING *`,
                [from_whom, whom, message, date]
            );
            res.json(response.rows);
        } catch (error) {
            console.log(error.message);
        }
    }
}

module.exports = new MessageController();
