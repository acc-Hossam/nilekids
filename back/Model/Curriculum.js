const mongoose = require('mongoose');

const curriculumSchema = new mongoose.Schema({
  grade: {
    type: String, // مثال: KG1, Grade 1, Grade 2
    required: true
  },
  gradeNumber: {
    type: Number, // رقم الصف (1,2,3...)
    required: true
  },
  intro: {
    type: String, // وصف أو مقدمة عن المنهج
    trim: true
  },
  img: {
    type: String // رابط صورة توضيحية للمنهج
  },
  courses: [{
    courseName: {
      type: String,
      required: true
    },
    courseId: {
      type: String
    },
    description: {
      type: String
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Curriculum', curriculumSchema);