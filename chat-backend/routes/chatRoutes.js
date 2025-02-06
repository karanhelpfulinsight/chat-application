const express = require('express')
const { accessChat, fetchAllChat } = require('../controllers/chatController')
const { authenticateUser } = require('../middlewares/authMiddleware')

const router = express.Router()

router.route('/get/:userId').get(authenticateUser,accessChat)
router.route('/all').get(authenticateUser,fetchAllChat)


module.exports = router