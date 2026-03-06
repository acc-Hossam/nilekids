const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    grade: {
        type: String, // KG1, KG2, أو أي مستوى
        required: true,
    },
    studentId: {
        type: String,
        unique: true,
        required: true,
    },
    img: {
        type: String, // رابط الصورة أو Base64
    },
    birthDay: {
        type: Date,
        required: true,
    },
    age: {
        type: Number,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    phoneNumber: {
        type: String,
    },
    whatsApp: {
        type: String,
    },
    userName: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    dressCode: {
        type: String, // زي موحد أو ملاحظات
    },
    missId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher", // ربط الطالب بالمعلمة
    },
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class", // ربط الطالب بالفصل
    },
    curriculumId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Curriculum", // ربط الطالب بالمنهج
    },
    evaluations: [
        {
            examId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Exam",
            },
            grade: Number,
            notes: String,
        }
    ],
    payments: [
        {
            amount: { type: Number },
            date: { type: Date, default: Date.now },
            month: { type: String },
            paymentType: { type: String, default: 'رسوم شهرية' },
        }
    ]
}, { timestamps: true });
// الـ hashing بيتعمل في الـ controller مباشرة
module.exports = mongoose.model("Student", studentSchema);