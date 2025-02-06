const express = require('express');
const { loginUser, registerUser, getAllUser, getOnlineStatus } = require('../controllers/userController');
const { authenticateUser } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route("/all").get(authenticateUser,getAllUser);

router.route("/login").post(loginUser);
router.route("/status/:userId").get(getOnlineStatus)
router.route("/").post(registerUser);

module.exports = router;