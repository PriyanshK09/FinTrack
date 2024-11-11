const express = require('express');
const { getEducationProgress, updateEducationProgress } = require('../controllers/educationController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getEducationProgress);
router.post('/', authMiddleware, updateEducationProgress);

module.exports = router;