const curriculumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  subjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Curriculum", curriculumSchema);