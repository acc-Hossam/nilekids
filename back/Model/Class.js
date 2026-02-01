const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  classId: {
    type: String,
    unique: true,
    required: true
  },
  className: {
    type: String,
    required: true,
    trim: true
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student' // ربط الفصل بالطلاب
  }],
  miss: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher', // ربط الفصل بالمدرس (هنعمل موديل Teacher لاحقًا)
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Class', classSchema);