const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  specialty: {
    type: String,
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
    }
  ],
  payments: [
    {
      amount: Number,
      date: Date,
      type: String,
    }
  ],
  subjectIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    }
  ]
}, { timestamps: true });

// الـ hashing بيتعمل في الـ controller مباشرة

module.exports = mongoose.model('Teacher', teacherSchema);