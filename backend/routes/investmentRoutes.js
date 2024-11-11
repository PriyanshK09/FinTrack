const express = require('express');
const { getInvestments, addInvestment } = require('../controllers/investmentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getInvestments);
router.post('/', authMiddleware, addInvestment);

module.exports = router;