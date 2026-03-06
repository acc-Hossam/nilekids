const express = require("express");
const dotenv = require('dotenv');
const cors = require('cors');
const router = express.Router();
const connectDB = require("./db/configconection")
//import mongoose 
const app = express();
//config dotenv
dotenv.config();
const port = process.env.PORT;
//import mongoose
const { authMiddleware, authorizeRoles } = require("./Middleware/auth.js");
//init default admin
const createDefaultAdmin = require("./initAdmin");
// بعد الاتصال بقاعدة البيانات
connectDB().then(() => {
  createDefaultAdmin();
});
//connectDB()
app.use(express.json());
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ message: "Something went wrong", error: err.message });
});



//import routes
const adminRoutes = require("./routes/adminRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const studentRoutes = require("./routes/studentRoutes");
const loginRoutes = require("./routes/loginRoutes");
const questionRoutes = require("./routes/questionRoutes");
const subjectRoutes = require("./routes/subjectRoutes");

// ✅ تسجيل كل الموديلات عشان الـ populate يشتغل صح
require("./Model/Admin");
require("./Model/TeacherSchema");
require("./Model/StudentSchema");
require("./Model/classSchema");
require("./Model/curriculumSchema");
require("./Model/Subject Schema.js");
app.use("/questions", questionRoutes);






//use routes
app.use("/admin", adminRoutes);
app.use("/teacher", teacherRoutes);
app.use("/student", studentRoutes);
app.use("/auth", loginRoutes);
app.use("/subjects", subjectRoutes);






app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
