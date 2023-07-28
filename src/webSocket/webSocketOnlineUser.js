const WebSocket = require("ws");
const db = require(`../postgreSQL/db`);
const wss = new WebSocket.Server({ port: 8080 });

const users = {};

function webSocketOnlineUser() {
    wss.on("connection", (ws) => {
        let userId = null;
        console.log("new user connecting");

        ws.on("message", (message) => {
            const user = JSON.parse(message);
            if (user.dataUser) {
                console.log(`user: ${user.login}`);
                const userLogin = user.login;
                userId = user.id;
                users[userId] = { userLogin, ws };

                try {
                    db.query(
                        `UPDATE person set online = $1 where id = $2 RETURNING *`,
                        [true, user.id]
                    );
                } catch (error) {
                    console.log(error.message);
                }
            } else {
                if (user.name && user.name !== "") {
                    for (const userIdLogin in users) {
                        if (user.name === users[userIdLogin].userLogin) {
                            if (user.delete === true) {
                                users[userIdLogin].ws.send(
                                    JSON.stringify({
                                        userFriends: {
                                            message:
                                                "you have been deleted from friends",
                                        },
                                    })
                                );
                            } else {
                                users[userIdLogin].ws.send(
                                    JSON.stringify({
                                        userFriends: {
                                            message:
                                                "you have been added to friends",
                                        },
                                    })
                                );
                            }
                        }
                    }
                }
                if (users[userId]) {
                    for (const userIdLogin in users) {
                        if (
                            user.whom === users[userIdLogin].userLogin ||
                            user.from_whom === users[userIdLogin].userLogin
                        ) {
                            users[userIdLogin].ws.send(JSON.stringify(user));
                        }
                    }
                }
            }
        });

        ws.on("close", () => {
            if (users[userId]) {
                const userLogin = users[userId].userLogin;
                console.log(
                    `the user ${userLogin} has logged out` +
                        "\n" +
                        "_______________________"
                );
                delete users[userId];
            }

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
