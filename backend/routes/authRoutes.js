const express = require('express');
const { signup, login, getUser, logout } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/user', authMiddleware, getUser);
router.post('/logout', authMiddleware, logout);

module.exports = router;