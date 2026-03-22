const express = require("express");
const router = express.Router();
const { authMiddleware, authorizeRoles } = require("../middleware/auth");
const teacherController = require("../controllers/teacherController");

// 🏠 Get Teacher's Dashboard Data (Classes and Students)
router.get("/dashboard", authMiddleware, authorizeRoles("teacher"), teacherController.getTeacherClassesAndStudents);

// 📝 Add Evaluation to a Student
router.post("/students/:id/evaluations", authMiddleware, authorizeRoles("teacher"), teacherController.addEvaluation);

// 📋 Get All Evaluations for a Student
router.get("/students/:id/evaluations", authMiddleware, authorizeRoles("teacher"), teacherController.getStudentEvaluations);

// 💰 Add Payment for a Student
router.post("/students/:id/payments", authMiddleware, authorizeRoles("teacher"), teacherController.addPayment);

// 📋 Get All Payments for a Student
router.get("/students/:id/payments", authMiddleware, authorizeRoles("teacher"), teacherController.getStudentPayments);

// 👁️ View Student Profile
router.get("/students/:id", authMiddleware, authorizeRoles("teacher"), teacherController.getStudentProfile);

module.exports = router;