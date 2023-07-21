const db = require(`../postgreSQL/db`);

class NotesController {
    async createNote(req, res) {
        try {
            const { name, textarea, color, user_id } = req.body;
            const response = await db.query(
                `INSERT INTO notes (name, textarea, color, user_id) VALUES ($1, $2, $3, $4) RETURNING *`,
                [name, textarea, color, user_id]
            );
            res.json({ message: "note created!", response: response });
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
                    response = await db.query(
                        `SELECT * FROM notes where user_id = $1`,
                        [user_id]
                    );
                    res.json(response.rows);
                    break;
                case "Are performed":
                    response = await db.query(
                        `SELECT * FROM notes where user_id = $1 AND done = false`,
                        [user_id]
                    );
                    res.json(response.rows);
                    break;
                case "Done":
                    response = await db.query(
                        `SELECT * FROM notes where user_id = $1 AND done = true`,
                        [user_id]
                    );
                    res.json(response.rows);
                    break;
            }
        } catch (error) {
            console.log(error.message);
        }
    }
    async editNote(req, res) {
        try {
            const data = req.body;
            const updateNote = await db.query(
                `UPDATE notes set name = $1, textarea = $2, color = $3, done = $4 where id = $5 RETURNING *`,
                [data.name, data.textarea, data.color, data.done, data.id]
            );
            res.json(updateNote.rows[0]);
        } catch (error) {
            console.log(error.message);
        }
    }

    async deleteNote(req, res) {
        try {
            const { id } = req.query;
            const note = await db.query(`DELETE FROM notes where id = $1`, [
                id,
            ]);
            res.json(note.rows);
        } catch (error) {
            console.log(error.message);
        }
    }
}

module.exports = new NotesController();
