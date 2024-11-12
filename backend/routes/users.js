const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

router.put('/settings', authMiddleware, userController.updateSettings);
router.post('/cancel-premium', authMiddleware, userController.cancelPremium);

module.exports = router;