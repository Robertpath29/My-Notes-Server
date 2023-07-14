const express = require(`express`);
const cors = require(`cors`);
const PORT = process.env.PORT || 5001;
const server = express();
const router = require(`./routers/routers`);

server.use(express.json());
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
