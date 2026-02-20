const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  specialty: {
    type: String, // مادة أساسية زي لغة عربية أو رياضيات
  },
  contact: {
    phone: String,
    email: String,
  },
  classIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    }
  ],
  evaluations: [
  {
    examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam" },
    grade: Number,
    notes: String,
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" }
  }
],
payments: [
  {
    amount: Number,
    date: Date,
    type: String,
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" }
  }
],
  subjectIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    }
  ]
}, { timestamps: true });

// تشفير الباسورد قبل الحفظ
studentSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();

  bcrypt.hash(this.password, 10)
    .then(hash => {
      this.password = hash;
      next();
    })
    .catch(err => next(err));
});

module.exports = mongoose.model('Teacher', teacherSchema);