const express = require("express");
const router = express.Router();
const { authMiddleware, authorizeRoles } = require("../Middleware/auth");
const questionController = require("../controllers/questionController");

// Admin يضيف سؤال
router.post("/", authMiddleware, authorizeRoles("admin"), questionController.addQuestion);

// عرض كل الأسئلة (Admin, Teacher)
router.get("/", authMiddleware, authorizeRoles("admin", "teacher"), questionController.getQuestions);

// عرض سؤال واحد
router.get("/:id", authMiddleware, authorizeRoles("admin", "teacher", "student"), questionController.getQuestionById);

// تعديل سؤال (Admin فقط)
router.put("/:id", authMiddleware, authorizeRoles("admin"), questionController.updateQuestion);

// حذف سؤال (Admin فقط)
router.delete("/:id", authMiddleware, authorizeRoles("admin"), questionController.deleteQuestion);

module.exports = router;