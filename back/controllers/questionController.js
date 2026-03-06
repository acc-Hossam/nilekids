const Question = require("../Model/questionSchema");

// 🟢 إضافة سؤال جديد
exports.addQuestion = async (req, res) => {
    try {
        const question = new Question(req.body);
        await question.save();
        res.status(201).json({ message: "Question added successfully", question });
    } catch (err) {
        res.status(400).json({ message: "Error adding question", error: err.message });
    }
};

// 🔵 عرض كل الأسئلة
exports.getQuestions = async (req, res) => {
    try {
        const questions = await Question.find();
        res.json(questions);
    } catch (err) {
        res.status(500).json({ message: "Error fetching questions", error: err.message });
    }
};

// 🟡 عرض سؤال واحد
exports.getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) return res.status(404).json({ message: "Question not found" });
        res.json(question);
    } catch (err) {
        res.status(500).json({ message: "Error fetching question", error: err.message });
    }
};

// 🟠 تعديل سؤال
exports.updateQuestion = async (req, res) => {
    try {
        const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!question) return res.status(404).json({ message: "Question not found" });
        res.json({ message: "Question updated successfully", question });
    } catch (err) {
        res.status(400).json({ message: "Error updating question", error: err.message });
    }
};

// 🔴 حذف سؤال
exports.deleteQuestion = async (req, res) => {
    try {
        const question = await Question.findByIdAndDelete(req.params.id);
        if (!question) return res.status(404).json({ message: "Question not found" });
        res.json({ message: "Question deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting question", error: err.message });
    }
};