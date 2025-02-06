const express = require('express');
const { loginUser, registerUser, getAllUser } = require('../controllers/userController');
const { authenticateUser } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route("/all").get(authenticateUser,getAllUser);
router.route("/").post(registerUser);
router.route("/login").post(loginUser);

module.exports = router;