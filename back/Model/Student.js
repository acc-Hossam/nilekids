const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    grade: {
        type: String,
        required: true
    },
    studentId: {   // بدل id علشان يكون أوضح
        type: String,
        unique: true,
        required: true
    },
    quiz: [{
        title: String,
        score: Number,
        date: Date
    }],
    courses: [{
        courseName: String,
        courseId: String
    }],
    img: {
        type: String // رابط الصورة
    },
    birthDay: {
        type: Date
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    phoneNumber: {
        type: String
    },
    whatsApp: {
        type: String
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    payments: [{
        amount: Number,
        date: Date,
        method: String
    }],
    monthsSubscribe: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    books: [{
        title: String,
        status: String // مستلم / غير مستلم
    }],
    dressCode: {
        type: String
    },
    missId: {
        type: String // ممكن يكون ID للمدرسة أو ولي الأمر
    },
    age: {
        type: Number
    },
    class: {
        type: String
    }
}, { timestamps: true });
studentSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
module.exports = mongoose.model('Student', studentSchema);