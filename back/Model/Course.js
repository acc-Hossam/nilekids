const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
    trim: true
  },
  intro: {
    type: String, // مقدمة أو وصف للكورس
    trim: true
  },
  img: {
    type: String // صورة أو أيقونة للكورس
  },
  vids: [{
    title: String,
    url: String,
    duration: Number // مدة الفيديو بالدقائق
  }],
  curriculum: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Curriculum', // ربط الكورس بالمنهج
    required: true
  },
  grade: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Grade' // ربط الكورس بالصف (هنعمله لاحقًا)
  },
  lessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson' // ربط الكورس بالدروس (هنعملها لاحقًا)
  }],
  materials: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material' // ربط الكورس بموارد إضافية (هنعملها لاحقًا)
  }]
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);