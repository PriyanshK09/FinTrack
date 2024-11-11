const Goal = require('../models/Goal');

exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addGoal = async (req, res) => {
  const { description, target, current } = req.body;

  try {
    const newGoal = new Goal({
      user: req.user.id,
      description,
      target,
      current,
    });

    const goal = await newGoal.save();
    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateGoal = async (req, res) => {
  const { description, target, current } = req.body;

  try {
    let goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    goal.description = description;
    goal.target = target;
    goal.current = current;

    await goal.save();
    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await goal.remove();
    res.json({ message: 'Goal removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};