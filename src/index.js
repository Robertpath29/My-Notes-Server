const express = require(`express`);
const cors = require(`cors`);
const PORT = process.env.PORT || 5001;
const router = require(`./routers/routers`);
const fileUpload = require(`express-fileupload`);
const server = express();

server.use(express.json());
server.use(express.static(`src/assets/userIcon`));
server.use(fileUpload({}));
server.use(
    cors({
        origin: "http://192.168.1.104:3000",
        credentials: true,
    })
);
server.use(`/`, router);

const startServer = () => {
    try {
        server.listen(PORT, "192.168.1.104", () =>
            console.log(`Server start from PORT=http://192.168.1.104:${PORT}`)
        );
    } catch (error) {
        console.log(error.message);
    }
};

startServer();
