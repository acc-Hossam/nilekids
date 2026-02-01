const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const teacherSchema = new mongoose.Schema({
  teacherId: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  grade: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Grade' // ربط المعلمة بالمرحلة الدراسية (هنعمل موديل Grade لاحقًا)
  },
  class: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class' // ربط المعلمة بالفصول اللي بتدرسها
  }],
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true });

// تشفير الباسورد قبل الحفظ
teacherSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('Teacher', teacherSchema);