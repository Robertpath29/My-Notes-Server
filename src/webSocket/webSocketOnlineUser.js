const WebSocket = require("ws");
const db = require(`../postgreSQL/db`);
const wss = new WebSocket.Server({ port: 8080 });
function webSocketOnlineUser() {
    wss.on("connection", (ws) => {
        let userLogin = "";
        let userId = null;
        console.log("new user connecting");

        ws.on("message", (message) => {
            const user = JSON.parse(message);
            console.log(`user: ${user.login}`);
            userLogin = user.login;
            userId = user.id;
            try {
                db.query(
                    `UPDATE person set online = $1 where id = $2 RETURNING *`,
                    [true, user.id]
                );
            } catch (error) {
                console.log(error.message);
            }
        });

        ws.on("close", () => {
            console.log(`the user ${userLogin} has logged out`);
            try {
                db.query(
                    `UPDATE person set online = $1 where id = $2 RETURNING *`,
                    [false, userId]
                );
            } catch (error) {
                console.log(error.message);
            }
        });
    });
}

module.exports = webSocketOnlineUser;
