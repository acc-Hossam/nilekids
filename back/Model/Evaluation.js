const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  evaluationId: {
    type: String,
    unique: true,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  missId: {
    type: String, // ممكن يكون ID للمدرس أو المسؤول اللي عمل التقييم
    required: true
  },
  atten: {
    type: Number, // نسبة الحضور أو درجة الحضور
    default: 0
  },
  proj: {
    type: Number, // تقييم المشروع أو النشاط
    default: 0
  },
  engage: {
    type: Number, // مدى التفاعل والمشاركة
    default: 0
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student', // ربط التقييم بالطالب
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Evaluation', evaluationSchema);