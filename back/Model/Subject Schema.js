const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  curriculumId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Curriculum",
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
  lessons: [
    {
      title: { type: String, required: true }, // اسم الدرس
      description: String, // وصف عام للدرس
      date: Date, // تاريخ الدرس
      contents: [
        {
          type: { type: String }, // نوع المحتوى (PDF, Video, Image, Text)
          url: String, // رابط المحتوى أو مسار الملف
          notes: String // ملاحظات إضافية
        }
      ]
    }
  ],
  books: [
    {
      title: String,
      author: String,
      fileUrl: String // رابط الكتاب لو PDF
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Subject", subjectSchema);
