const express = require("express");
const router = express.Router();
const { authMiddleware, authorizeRoles } = require("../Middleware/auth");
const adminController = require("../controllers/adminController");
const classController = require("../controllers/classController");

// ============================================================
// 👩‍🏫 TEACHERS
// ============================================================
router.post("/teachers", authMiddleware, authorizeRoles("admin"), adminController.addTeacher);
router.get("/teachers", authMiddleware, authorizeRoles("admin"), adminController.getAllTeachers);
router.get("/teachers/:id", authMiddleware, authorizeRoles("admin"), adminController.getTeacherById);
router.put("/teachers/:id", authMiddleware, authorizeRoles("admin"), adminController.updateTeacher);
router.delete("/teachers/:id", authMiddleware, authorizeRoles("admin"), adminController.deleteTeacher);

// ============================================================
// 🎓 STUDENTS
// ============================================================
router.post("/students", authMiddleware, authorizeRoles("admin"), adminController.addStudent);
router.get("/students", authMiddleware, authorizeRoles("admin"), adminController.getAllStudents);
router.get("/students/:id", authMiddleware, authorizeRoles("admin"), adminController.getStudentById);
router.put("/students/:id", authMiddleware, authorizeRoles("admin"), adminController.updateStudent);
router.delete("/students/:id", authMiddleware, authorizeRoles("admin"), adminController.deleteStudent);

// ============================================================
// 📚 SUBJECTS
// ============================================================
router.post("/subjects", authMiddleware, authorizeRoles("admin"), adminController.addSubject);
router.get("/subjects", authMiddleware, authorizeRoles("admin"), adminController.getAllSubjects);
router.get("/subjects/:id", authMiddleware, authorizeRoles("admin"), adminController.getSubjectById);
router.put("/subjects/:id", authMiddleware, authorizeRoles("admin"), adminController.updateSubject);
router.delete("/subjects/:id", authMiddleware, authorizeRoles("admin"), adminController.deleteSubject);

// ============================================================
// 🏫 CLASSES
// ============================================================
router.post("/classes", authMiddleware, authorizeRoles("admin"), classController.createClass);
router.get("/classes", authMiddleware, authorizeRoles("admin", "teacher"), classController.getAllClasses);
router.get("/classes/:id", authMiddleware, authorizeRoles("admin", "teacher"), classController.getClassById);
router.put("/classes/:id", authMiddleware, authorizeRoles("admin"), classController.updateClass);
router.delete("/classes/:id", authMiddleware, authorizeRoles("admin"), classController.deleteClass);
// إضافة معلمة / طالب لفصل
router.post("/classes/:id/assign-teacher", authMiddleware, authorizeRoles("admin"), classController.assignTeacher);
router.post("/classes/:id/assign-student", authMiddleware, authorizeRoles("admin"), classController.assignStudent);

// ============================================================
// 💰 PAYMENTS
// ============================================================
router.get("/payments", authMiddleware, authorizeRoles("admin"), adminController.getAllStudentsPayments);
router.get("/students/:studentId/payments", authMiddleware, authorizeRoles("admin"), adminController.getPayments);
router.post("/students/:studentId/payments", authMiddleware, authorizeRoles("admin"), adminController.addPayment);
router.delete("/students/:studentId/payments/:paymentId", authMiddleware, authorizeRoles("admin"), adminController.deletePayment);

module.exports = router;