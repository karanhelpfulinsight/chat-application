const express = require('express');
const { sendMessage, allMessages, getAllMessageByUserId } = require('../controllers/messageController');
const { authenticateUser } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route("/send").post(authenticateUser,sendMessage)
router.route("/user/:userId").get(getAllMessageByUserId)
router.route("/:chatId").get(authenticateUser,allMessages)



module.exports = router;

