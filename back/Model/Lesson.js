const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    lessonId: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    intro: {
        type: String, // مقدمة أو وصف للدرس
        trim: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course', // ربط الدرس بالكورس
        required: true
    },
    vids: [{
        title: String,
        url: String,
        duration: Number // مدة الفيديو بالدقائق
    }],
    materials: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Material' // ربط الدرس بموارد إضافية (هنعمل موديل Material لاحقًا)
    }],
    links: [{
        title: String,
        url: String
    }]
}, { timestamps: true });

module.exports = mongoose.model('Lesson', lessonSchema);