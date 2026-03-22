const bcrypt = require("bcryptjs");
const Student = require("../Model/StudentSchema");
const Teacher = require("../Model/TeacherSchema");
const Subject = require("../Model/Subject Schema.js");

// ============================================================
// 👩‍🏫 TEACHERS
// ============================================================

// ➕ Add Teacher
exports.addTeacher = async (req, res) => {
    try {
        const { name, username, specialty, contact, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const teacher = new Teacher({ name, username, specialty, contact, password: hashedPassword });
        await teacher.save();
        res.status(201).json({ message: "Teacher added successfully", teacher });
    } catch (err) {
        res.status(400).json({ message: "Error adding teacher", error: err.message });
    }
};

// 📋 Get All Teachers
exports.getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find().populate("classIds").populate("subjectIds");
        res.json(teachers);
    } catch (err) {
        res.status(500).json({ message: "Error fetching teachers", error: err.message });
    }
};

// 🔍 Get Teacher by ID
exports.getTeacherById = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id).populate("classIds").populate("subjectIds");
        if (!teacher) return res.status(404).json({ message: "Teacher not found" });
        res.json(teacher);
    } catch (err) {
        res.status(500).json({ message: "Error fetching teacher", error: err.message });
    }
};

// ✏️ Update Teacher
exports.updateTeacher = async (req, res) => {
    try {
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }
        const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!teacher) return res.status(404).json({ message: "Teacher not found" });
        res.json({ message: "Teacher updated successfully", teacher });
    } catch (err) {
        res.status(400).json({ message: "Error updating teacher", error: err.message });
    }
};

// 🗑️ Delete Teacher
exports.deleteTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndDelete(req.params.id);
        if (!teacher) return res.status(404).json({ message: "Teacher not found" });
        res.json({ message: "Teacher deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting teacher", error: err.message });
    }
};

// ============================================================
// 🎓 STUDENTS
// ============================================================

// ➕ Add Student
exports.addStudent = async (req, res) => {
    console.log(req.body);
    try {
        const { name, grade, studentId, birthDay, userName, password, phoneNumber, whatsApp, dressCode, missId, classId, curriculumId } = req.body;

        // Validate required fields
        if (!name || !grade || !studentId || !birthDay || !userName || !password) {
            return res.status(400).json({
                message: "الحقول المطلوبة ناقصة: name, grade, studentId, birthDay, userName, password",
                error: "Missing required fields"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const student = new Student({
            name, grade, studentId, birthDay, userName,
            password: hashedPassword, phoneNumber, whatsApp,
            dressCode, missId, classId, curriculumId
        });
        await student.save();
        res.status(201).json({ message: "Student added successfully", student });
    } catch (err) {
        res.status(400).json({ message: "Error adding student", error: err.message });
    }
};

// 📋 Get All Students
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find({ isDeleted: false })
            .populate("missId", "name specialty")
            .populate("classId")
            .populate("curriculumId");
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: "Error fetching students", error: err.message });
    }
};

// 🔍 Get Student by ID
exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id)
            .populate("missId", "name specialty")
            .populate("classId")
            .populate("curriculumId");
        if (!student || student.isDeleted) return res.status(404).json({ message: "Student not found" });
        res.json(student);
    } catch (err) {
        res.status(500).json({ message: "Error fetching student", error: err.message });
    }
};

// ✏️ Update Student
exports.updateStudent = async (req, res) => {
    try {
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!student) return res.status(404).json({ message: "Student not found" });
        res.json({ message: "Student updated successfully", student });
    } catch (err) {
        res.status(400).json({ message: "Error updating student", error: err.message });
    }
};

// 🗑️ Soft Delete Student
exports.deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!student) return res.status(404).json({ message: "Student not found" });
        res.json({ message: "Student deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting student", error: err.message });
    }
};

// ============================================================
// 📚 SUBJECTS
// ============================================================

// ➕ Add Subject
exports.addSubject = async (req, res) => {
    try {
        const subject = new Subject(req.body);
        await subject.save();
        res.status(201).json({ message: "Subject added successfully", subject });
    } catch (err) {
        res.status(400).json({ message: "Error adding subject", error: err.message });
    }
};

// 📋 Get All Subjects
exports.getAllSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find().populate("teacherId", "name").populate("curriculumId", "name year");
        res.json(subjects);
    } catch (err) {
        res.status(500).json({ message: "Error fetching subjects", error: err.message });
    }
};

// 🔍 Get Subject by ID
exports.getSubjectById = async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id).populate("teacherId", "name").populate("curriculumId", "name year");
        if (!subject) return res.status(404).json({ message: "Subject not found" });
        res.json(subject);
    } catch (err) {
        res.status(500).json({ message: "Error fetching subject", error: err.message });
    }
};

// ✏️ Update Subject
exports.updateSubject = async (req, res) => {
    try {
        const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!subject) return res.status(404).json({ message: "Subject not found" });
        res.json({ message: "Subject updated successfully", subject });
    } catch (err) {
        res.status(400).json({ message: "Error updating subject", error: err.message });
    }
};

// 🗑️ Delete Subject
exports.deleteSubject = async (req, res) => {
    try {
        const subject = await Subject.findByIdAndDelete(req.params.id);
        if (!subject) return res.status(404).json({ message: "Subject not found" });
        res.json({ message: "Subject deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting subject", error: err.message });
    }
};
// ============================================================
// 💰 PAYMENTS
// ============================================================

// ➕ Add payment to a student
exports.addPayment = async (req, res) => {
    try {
        const { amount, month, type } = req.body;
        if (!amount || !month) {
            return res.status(400).json({ message: "amount and month are required" });
        }
        const student = await Student.findById(req.params.studentId);
        if (!student || student.isDeleted) return res.status(404).json({ message: "Student not found" });

        student.payments.push({ amount, month, paymentType: type || 'رسوم شهرية' });
        await student.save();

        res.status(201).json({ message: "Payment added successfully", payments: student.payments });
    } catch (err) {
        res.status(400).json({ message: "Error adding payment", error: err.message });
    }
};

// 📋 Get all payments for a student
exports.getPayments = async (req, res) => {
    try {
        const student = await Student.findById(req.params.studentId).select("name payments");
        if (!student || student.isDeleted) return res.status(404).json({ message: "Student not found" });
        res.json({ student: { _id: student._id, name: student.name }, payments: student.payments });
    } catch (err) {
        res.status(500).json({ message: "Error fetching payments", error: err.message });
    }
};

// 🗑️ Delete a payment from a student
exports.deletePayment = async (req, res) => {
    try {
        const student = await Student.findById(req.params.studentId);
        if (!student || student.isDeleted) return res.status(404).json({ message: "Student not found" });

        student.payments.pull({ _id: req.params.paymentId });
        await student.save();

        res.json({ message: "Payment deleted successfully", payments: student.payments });
    } catch (err) {
        res.status(500).json({ message: "Error deleting payment", error: err.message });
    }
};

// 📋 Get ALL students with payment summary
exports.getAllStudentsPayments = async (req, res) => {
    try {
        const students = await Student.find({ isDeleted: false }).select("name grade payments studentId");
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: "Error", error: err.message });
    }
};
