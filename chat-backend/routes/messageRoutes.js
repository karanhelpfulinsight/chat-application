const express = require('express');
const { sendMessage, allMessages } = require('../controllers/messageController');
const { authenticateUser } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route("/send").post(authenticateUser,sendMessage)
router.route("/").get(allMessages)


module.exports = router;

