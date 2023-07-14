const Routers = require(`express`);
const userController = require("../controllers/userController");
const userInfoController = require("../controllers/userInfoController");

const router = new Routers();

router.post(`/registration`, userController.createUser);
router.get(`/login`, userController.getLogInUser);
router.post(`/InfoUser`, userInfoController.createInfoUser);
router.get(`/InfoUser`, userInfoController.getInfoUser);

module.exports = router;
