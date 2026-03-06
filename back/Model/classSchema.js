const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  grade: {
    type: String, // KG1, KG2, Grade1 ...
  },
  teacherIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    }
  ],
  studentIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    }
  ],
  curriculumId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Curriculum",
  }
}, { timestamps: true });

module.exports = mongoose.model("Class", classSchema);