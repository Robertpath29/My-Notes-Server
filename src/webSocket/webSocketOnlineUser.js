const WebSocket = require("ws");
const db = require("../mysql/db");

const users = {};

function webSocketOnlineUser(httpServer) {
    const wss = new WebSocket.Server({ server: httpServer });
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
                    db.promise().query(
                        `UPDATE person set online = ? where id = ?`,
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
                db.promise().query(
                    `UPDATE person set online = ? where id = ?`,
                    [false, userId]
                );
            } catch (error) {
                console.log(error.message);
            }
        });
    });
}

module.exports = webSocketOnlineUser;
