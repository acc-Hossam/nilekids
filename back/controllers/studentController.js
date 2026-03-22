const Student = require("../Model/StudentSchema");
const Subject = require("../Model/Subject Schema.js");

// 👁️ Get My Profile (the logged-in student)
exports.getMyProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.user.id)
            .select("-password")
            .populate("missId", "name specialty contact")
            .populate("classId")
            .populate("curriculumId");

        if (!student || student.isDeleted) return res.status(404).json({ message: "Student not found" });
        res.json(student);
    } catch (err) {
        res.status(500).json({ message: "Error fetching profile", error: err.message });
    }
};

// 📝 Get My Evaluations
exports.getMyEvaluations = async (req, res) => {
    try {
        const student = await Student.findById(req.user.id);
        if (!student || student.isDeleted) return res.status(404).json({ message: "Student not found" });
        res.json({ evaluations: student.evaluations });
    } catch (err) {
        res.status(500).json({ message: "Error fetching evaluations", error: err.message });
    }
};

// 💰 Get My Payments
exports.getMyPayments = async (req, res) => {
    try {
        const student = await Student.findById(req.user.id);
        if (!student || student.isDeleted) return res.status(404).json({ message: "Student not found" });
        res.json({ payments: student.payments });
    } catch (err) {
        res.status(500).json({ message: "Error fetching payments", error: err.message });
    }
};

// 📚 Get My Subjects (By Grade)
exports.getMySubjects = async (req, res) => {
    try {
        const student = await Student.findById(req.user.id);
        if (!student || student.isDeleted) return res.status(404).json({ message: "Student not found" });

        // نرجع المواد اللي بتعتمد على صف أو مرحلة الطالب
        const subjects = await Subject.find({ grade: student.grade })
            .populate("curriculumId", "name")
            .populate("teacherId", "name");

        res.json({ subjects });
    } catch (err) {
        res.status(500).json({ message: "Error fetching subjects", error: err.message });
    }
};