const Education = require('../models/Education');

exports.getEducationProgress = async (req, res) => {
  try {
    const education = await Education.findOne({ user: req.user.id });
    res.json(education);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateEducationProgress = async (req, res) => {
  const { completedTopics, quizScore } = req.body;

  try {
    let education = await Education.findOne({ user: req.user.id });

    if (!education) {
      education = new Education({
        user: req.user.id,
        completedTopics,
        quizScore,
      });
    } else {
      education.completedTopics = completedTopics;
      education.quizScore = quizScore;
    }

    await education.save();
    res.json(education);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};