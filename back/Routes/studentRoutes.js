const express = require("express");
const router = express.Router();
const studentController = require("../Controllers/studentController");
router.get("/add", studentController.addStudent);
// router.get("/get", studentController.getStudents);
// router.get("/get/:id", studentController.getStudentById);
// router.put("/update/:id", studentController.updateStudent);
// router.delete("/delete/:id", studentController.deleteStudent);
module.exports = router;