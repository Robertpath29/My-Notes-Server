const Routers = require(`express`);
const userController = require("../controllers/userController");
const userInfoController = require("../controllers/userInfoController");
const notesController = require("../controllers/notesController");
const friendsController = require("../controllers/friendsController");
const messageController = require("../controllers/messageController");
const unreadMessageController = require("../controllers/unreadMessageController");

const router = new Routers();

router.post(`/registration`, userController.createUser);
router.get(`/login`, userController.getLogInUser);
router.get(`/user`, userController.getUser);
router.post(`/InfoUser`, userInfoController.createInfoUser);
router.get(`/InfoUser`, userInfoController.getInfoUser);
router.put(`/InfoUser`, userInfoController.editInfoUser);
router.post(`/newNote`, notesController.createNote);
router.get(`/newNote`, notesController.getNotes);
router.put(`/newNote`, notesController.editNote);
router.delete(`/newNote`, notesController.deleteNote);
router.post(`/friends`, friendsController.addFriends);
router.get(`/friends`, friendsController.getFriends);
router.delete(`/friends`, friendsController.deleteFriends);
router.get(`/friends/message`, messageController.getMessage);
router.post(`/friends/message`, messageController.addMessage);
router.get(`/friends/unread/message`, unreadMessageController.getUnreadMessage);
router.post(
    `/friends/unread/message`,
    unreadMessageController.addUnreadMessage
);
router.delete(
    `/friends/unread/message`,
    unreadMessageController.deleteUnreadMessage
);

module.exports = router;
