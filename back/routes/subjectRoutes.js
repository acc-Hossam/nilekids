const express = require("express");
const router = express.Router();
const {
    getSubjects,
    getSubjectById,
    createSubject,
    updateSubject,
    deleteSubject,
    addLesson,
    updateLesson,
    deleteLesson
} = require("../controllers/subjectController");
const { authMiddleware, authorizeRoles } = require("../Middleware/auth");

// Protect all routes
router.use(authMiddleware);

// Admin-only routes
router.use(authorizeRoles("admin"));

router.route("/")
    .get(getSubjects)
    .post(createSubject);

router.route("/:id")
    .get(getSubjectById)
    .put(updateSubject)
    .delete(deleteSubject);

// Lesson Management Routes
router.route("/:id/lessons")
    .post(addLesson);

router.route("/:id/lessons/:lessonId")
    .put(updateLesson)
    .delete(deleteLesson);

module.exports = router;
