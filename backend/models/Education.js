const mongoose = require('mongoose');

const EducationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  completedTopics: { type: [Number], required: true },
  quizScore: { type: Number, required: true },
});

module.exports = mongoose.model('Education', EducationSchema);