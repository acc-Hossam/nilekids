const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  quizId: {
    type: String,
    unique: true,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  mark: {
    type: Number, // الدرجة اللي حصل عليها الطالب
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student', // ربط الاختبار بالطالب
    required: true
  },
  grade: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Grade' // ربط الاختبار بالصف الدراسي (هنعمل موديل Grade لاحقًا)
  }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);