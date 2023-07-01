const Routers = require(`express`);
const userController = require("../controllers/userController");

const router = new Routers();

router.post(`/registration`, userController.createUser);

module.exports = router;
