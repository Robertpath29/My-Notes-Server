const db = require("../mysql/db");

class NotesController {
    async createNote(req, res) {
        try {
            const { name, textarea, color, user_id } = req.body;
            const [response] = await db
                .promise()
                .query(
                    `INSERT INTO notes (name, textarea, color, user_id) VALUES (?, ?, ?, ?)`,
                    [name, textarea, color, user_id]
                );
            if (response) {
                res.json({ message: "note created" });
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    async getNotes(req, res) {
        try {
            const { user_id, select } = req.query;
            let response = null;
            switch (select) {
                case "All":
                    [response] = await db
                        .promise()
                        .query(`SELECT * FROM notes WHERE user_id = ?`, [
                            user_id,
                        ]);
                    res.json(response);
                    break;
                case "Are performed":
                    [response] = await db
                        .promise()
                        .query(
                            `SELECT * FROM notes WHERE user_id = ? AND done = false`,
                            [user_id]
                        );
                    res.json(response);
                    break;
                case "Done":
                    [response] = await db
                        .promise()
                        .query(
                            `SELECT * FROM notes WHERE user_id = ? AND done = true`,
                            [user_id]
                        );
                    res.json(response);
                    break;
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    async editNote(req, res) {
        try {
            const data = req.body;
            const [updateNote] = await db
                .promise()
                .query(
                    `UPDATE notes SET name = ?, textarea = ?, color = ?, done = ? WHERE id = ?`,
                    [data.name, data.textarea, data.color, data.done, data.id]
                );
            if (updateNote) {
                res.json({ message: "note update" });
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    async deleteNote(req, res) {
        try {
            const { id } = req.query;
            const [note] = await db
                .promise()
                .query(`DELETE FROM notes WHERE id = ?`, [id]);
            if (note) {
                res.json({ message: "note delete" });
            }
        } catch (error) {
            console.log(error.message);
        }
    }
}

module.exports = new NotesController();
