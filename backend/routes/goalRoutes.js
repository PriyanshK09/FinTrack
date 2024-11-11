const express = require('express');
const { getGoals, addGoal, updateGoal, deleteGoal } = require('../controllers/goalController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getGoals);
router.post('/', authMiddleware, addGoal);
router.put('/:id', authMiddleware, updateGoal);
router.delete('/:id', authMiddleware, deleteGoal);

module.exports = router;