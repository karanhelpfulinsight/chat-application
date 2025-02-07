const express = require('express')
const { accessChat, fetchAllChat, accessChatById } = require('../controllers/chatController')
const { authenticateUser } = require('../middlewares/authMiddleware')

const router = express.Router()

router.route('/user/:userId').get(authenticateUser,accessChat)
router.route('/all').get(authenticateUser,fetchAllChat)
router.route('/:chatId').get(authenticateUser,accessChatById)




module.exports = router