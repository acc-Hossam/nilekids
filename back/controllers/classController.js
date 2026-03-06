const Class = require("../Model/classSchema");
const Teacher = require("../Model/TeacherSchema");
const Student = require("../Model/StudentSchema");

// ============================================================
// ➕ Create Class
// ============================================================
exports.createClass = async (req, res) => {
    try {
        const { name, grade } = req.body;
        if (!name) {
            return res.status(400).json({ message: "اسم الفصل مطلوب" });
        }
        const newClass = new Class({ name, grade });
        await newClass.save();
        res.status(201).json({ message: "Class created successfully", class: newClass });
    } catch (err) {
        res.status(400).json({ message: "Error creating class", error: err.message });
    }
};

// ============================================================
// 📋 Get All Classes (with populated teachers & students count)
// ============================================================
exports.getAllClasses = async (req, res) => {
    try {
        const classes = await Class.find()
            .populate("teacherIds", "name specialty")
            .populate("studentIds", "name studentId grade");
        res.json(classes);
    } catch (err) {
        res.status(500).json({ message: "Error fetching classes", error: err.message });
    }
};

// ============================================================
// 🔍 Get Class by ID
// ============================================================
exports.getClassById = async (req, res) => {
    try {
        const cls = await Class.findById(req.params.id)
            .populate("teacherIds", "name specialty")
            .populate("studentIds", "name studentId grade");
        if (!cls) return res.status(404).json({ message: "Class not found" });
        res.json(cls);
    } catch (err) {
        res.status(500).json({ message: "Error fetching class", error: err.message });
    }
};

// ============================================================
// ✏️ Update Class (name, grade)
// ============================================================
exports.updateClass = async (req, res) => {
    try {
        const cls = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!cls) return res.status(404).json({ message: "Class not found" });
        res.json({ message: "Class updated successfully", class: cls });
    } catch (err) {
        res.status(400).json({ message: "Error updating class", error: err.message });
    }
};

// ============================================================
// 🗑️ Delete Class
// ============================================================
exports.deleteClass = async (req, res) => {
    try {
        const cls = await Class.findByIdAndDelete(req.params.id);
        if (!cls) return res.status(404).json({ message: "Class not found" });
        res.json({ message: "Class deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting class", error: err.message });
    }
};

// ============================================================
// 👩‍🏫 Assign Teacher to Class (إضافة معلمة لفصل)
// ============================================================
exports.assignTeacher = async (req, res) => {
    try {
        const { teacherId } = req.body;
        const cls = await Class.findById(req.params.id);
        if (!cls) return res.status(404).json({ message: "Class not found" });

        if (!cls.teacherIds.includes(teacherId)) {
            cls.teacherIds.push(teacherId);
            await cls.save();
        }

        // كمان نضيف الفصل في Teacher
        await Teacher.findByIdAndUpdate(
            teacherId,
            { $addToSet: { classIds: cls._id } }
        );

        res.json({ message: "Teacher assigned to class", class: cls });
    } catch (err) {
        res.status(400).json({ message: "Error assigning teacher", error: err.message });
    }
};

// ============================================================
// 🎓 Assign Student to Class (إضافة طالب لفصل)
// ============================================================
exports.assignStudent = async (req, res) => {
    try {
        const { studentId } = req.body;
        const cls = await Class.findById(req.params.id);
        if (!cls) return res.status(404).json({ message: "Class not found" });

        if (!cls.studentIds.includes(studentId)) {
            cls.studentIds.push(studentId);
            await cls.save();
        }

        // كمان نحدث الطالب بالـ classId
        await Student.findByIdAndUpdate(studentId, { classId: cls._id });

        res.json({ message: "Student assigned to class", class: cls });
    } catch (err) {
        res.status(400).json({ message: "Error assigning student", error: err.message });
    }
};
