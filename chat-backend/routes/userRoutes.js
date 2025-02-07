const express = require('express');
const { loginUser, registerUser, getAllUser, getOnlineStatus, getUserBySearch } = require('../controllers/userController');
const { authenticateUser } = require('../middlewares/authMiddleware');

const router = express.Router();
router.route("/").post(registerUser);
router.route("/all").get(authenticateUser,getAllUser);

router.route("/login").post(loginUser);
router.route("/status/:userId").get(getOnlineStatus)
router.route("/search").get(authenticateUser,getUserBySearch);


module.exports = router;