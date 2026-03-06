const express = require("express");
const router = express.Router();
const { authMiddleware, authorizeRoles } = require("../Middleware/auth");
const studentController = require("../controllers/studentController");

// 👁️ Student يشوف بياناته
router.get("/me", authMiddleware, authorizeRoles("student"), studentController.getMyProfile);

// 📝 Student يشوف تقييماته
router.get("/me/evaluations", authMiddleware, authorizeRoles("student"), studentController.getMyEvaluations);

// 💰 Student يشوف مدفوعاته
router.get("/me/payments", authMiddleware, authorizeRoles("student"), studentController.getMyPayments);

// 📚 Student يشوف مواده الدراسية
router.get("/me/subjects", authMiddleware, authorizeRoles("student"), studentController.getMySubjects);

module.exports = router;