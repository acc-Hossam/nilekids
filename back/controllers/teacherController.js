const Student = require("../Model/StudentSchema");

// ============================================================
// 👩‍🏫 TEACHER DASHBOARD
// ============================================================

// 📋 Get Teacher's Classes and Students
exports.getTeacherClassesAndStudents = async (req, res) => {
    try {
        const teacherId = req.user.id;

        // جلب الفصول التي تدرسها المعلمة مع بيانات الطلاب
        const classes = await require("../Model/classSchema").find({ teacherIds: teacherId })
            .populate({
                path: 'studentIds',
                select: 'name grade studentId evaluations phoneNumber whatsApp'
            });

        // جلب الطلاب المرتبطين بالمعلمة مباشرة (لو لم يكونوا في الفصول)
        const directStudents = await Student.find({ missId: teacherId })
            .select('name grade studentId evaluations phoneNumber whatsApp classId');

        res.json({
            classes,
            directStudents
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching teacher data", error: err.message });
    }
};

// ============================================================
// 📝 EVALUATIONS
// ============================================================

// ➕ Add Evaluation to a Student
exports.addEvaluation = async (req, res) => {
    try {
        const { examId, grade, notes } = req.body;
        const student = await Student.findById(req.params.id);
        if (!student || student.isDeleted) return res.status(404).json({ message: "Student not found" });

        student.evaluations.push({ examId, grade, notes });
        await student.save();

        res.status(201).json({ message: "Evaluation added successfully", evaluations: student.evaluations });
    } catch (err) {
        res.status(400).json({ message: "Error adding evaluation", error: err.message });
    }
};

// 📋 Get All Evaluations for a Student
exports.getStudentEvaluations = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate("evaluations.examId");
        if (!student || student.isDeleted) return res.status(404).json({ message: "Student not found" });
        res.json({ studentName: student.name, evaluations: student.evaluations });
    } catch (err) {
        res.status(500).json({ message: "Error fetching evaluations", error: err.message });
    }
};

// ============================================================
// 💰 PAYMENTS
// ============================================================

// ➕ Add Payment to a Student
exports.addPayment = async (req, res) => {
    try {
        const { amount, date, type } = req.body;
        const student = await Student.findById(req.params.id);
        if (!student || student.isDeleted) return res.status(404).json({ message: "Student not found" });

        student.payments.push({ amount, date: date || Date.now(), type });
        await student.save();

        res.status(201).json({ message: "Payment added successfully", payments: student.payments });
    } catch (err) {
        res.status(400).json({ message: "Error adding payment", error: err.message });
    }
};

// 📋 Get All Payments for a Student
exports.getStudentPayments = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student || student.isDeleted) return res.status(404).json({ message: "Student not found" });
        res.json({ studentName: student.name, payments: student.payments });
    } catch (err) {
        res.status(500).json({ message: "Error fetching payments", error: err.message });
    }
};

// 👁️ Get Student Profile (Teacher view - limited info)
exports.getStudentProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id)
            .select("-password")
            .populate("classId")
            .populate("curriculumId");
        if (!student || student.isDeleted) return res.status(404).json({ message: "Student not found" });
        res.json(student);
    } catch (err) {
        res.status(500).json({ message: "Error fetching student profile", error: err.message });
    }
};
