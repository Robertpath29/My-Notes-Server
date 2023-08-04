const express = require(`express`);
const webSocketOnlineUser = require(`./webSocket/webSocketOnlineUser`);
const http = require("http");
const cors = require(`cors`);
const router = require(`./routers/routers`);
const fileUpload = require(`express-fileupload`);
const server = express();
const PORT = process.env.PORT || 5001;

server.use(express.json());
server.use(express.static(`./assets/userIcon`));
server.use(fileUpload({}));
server.use(
    cors({
        origin: "https://my-notes-wheat.vercel.app",
        credentials: true,
    })
);
server.use(`/`, router);
const httpServer = http.createServer(server);
const startServer = () => {
    try {
        httpServer.listen(PORT, () =>
            console.log(`Server start from PORT=${PORT}`)
        );
    } catch (error) {
        console.log(error.message);
    }
};
startServer();
webSocketOnlineUser(httpServer);
