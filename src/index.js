const express = require(`express`);
const cors = require(`cors`);
const PORT = process.env.PORT || 5001;
const server = express();
const router = require(`./routers/routers`);

server.use(express.json());
server.use(cors());
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
