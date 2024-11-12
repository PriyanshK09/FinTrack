const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware'); // Fix import
const userController = require('../controllers/userController');

router.put('/settings', authMiddleware, userController.updateSettings);

module.exports = router;