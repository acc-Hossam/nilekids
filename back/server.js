const express = require("express");
const app = express();
const port = 3000;
//config dotenv
require("dotenv").config();
//import mongoose
//const mongoose = require("./db/configconection").mongoose;

app.use(express.json());
//import routes
const studentRoutes = require("./Routes/studentRoutes");
const teacherRoutes = require("./Routes/teacherRoutes");
const classRoutes = require("./Routes/classRoutes");
const curriculumRoutes = require("./Routes/curriculumRoutes");
const courseRoutes = require("./Routes/courseRoutes");
const lessonRoutes = require("./Routes/lessonRoutes");
const quizRoutes = require("./Routes/quizRoutes");
const evaluationRoutes = require("./Routes/evaluationRoutes");
const paymentRoutes = require("./Routes/paymentRoutes");
const adminRoutes = require("./Routes/adminRoutes");


//use routes
app.use("/student", studentRoutes);
// app.use("/teacher", teacherRoutes);
// app.use("/class", classRoutes);
// app.use("/curriculum", curriculumRoutes);
// app.use("/course", courseRoutes);
// app.use("/lesson", lessonRoutes);
// app.use("/quiz", quizRoutes);
// app.use("/evaluation", evaluationRoutes);
// app.use("/payment", paymentRoutes);
// app.use("/admin", adminRoutes);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});