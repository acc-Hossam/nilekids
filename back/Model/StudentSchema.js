const mongoose = require("mongoose");

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
            amount: Number,
            date: Date,
            type: String, // رسوم شهرية، كتب، أنشطة
        }
    ]
}, { timestamps: true });
studentSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
module.exports = mongoose.model("Student", studentSchema);