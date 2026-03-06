const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      "match-image-letter",
      "match-image-word",
      "mcq",
      "image-question",
      "audio-question",
      "count-shapes",
      "math"
    ],
    required: true
  },
  text: { type: String }, // نص السؤال لو موجود
  imageUrl: { type: String }, // لو السؤال صورة
  audioUrl: { type: String }, // لو السؤال صوت
  options: [
    {
      label: String, // النص أو الحرف أو الكلمة
      imageUrl: String, // لو الاختيار صورة
      isCorrect: Boolean
    }
  ],
  answer: { type: String }, // للإجابات البسيطة زي الجمع والطرح
  difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "easy" }
}, { timestamps: true });

module.exports = mongoose.model("Question", questionSchema);