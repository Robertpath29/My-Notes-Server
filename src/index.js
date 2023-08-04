const express = require(`express`);
const webSocketOnlineUser = require(`./webSocket/webSocketOnlineUser`);
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
        credentials: true,
    })
);
server.use(`/`, router);

const startServer = () => {
    try {
        server.listen(PORT, () =>
            console.log(`Server start from PORT=${PORT}`)
        );
    } catch (error) {
        console.log(error.message);
    }
};

startServer();
webSocketOnlineUser();
