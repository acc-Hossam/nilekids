const Subject = require("../Model/Subject Schema.js");

// @desc    Get all subjects (Admin can filter by grade)
// @route   GET /admin/subjects
const getSubjects = async (req, res) => {
    try {
        const { grade } = req.query;
        const filter = grade ? { grade } : {};

        const subjects = await Subject.find(filter)
            .populate("curriculumId", "name")
            .populate("teacherId", "name");

        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: "Error fetching subjects", error: error.message });
    }
};

// @desc    Get single subject
// @route   GET /admin/subjects/:id
const getSubjectById = async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id)
            .populate("curriculumId", "name")
            .populate("teacherId", "name");

        if (!subject) return res.status(404).json({ message: "Subject not found" });
        res.json(subject);
    } catch (error) {
        res.status(500).json({ message: "Error fetching subject", error: error.message });
    }
};

// @desc    Create a new subject
// @route   POST /admin/subjects
const createSubject = async (req, res) => {
    try {
        const { name, grade, curriculumId, teacherId } = req.body;

        const newSubject = new Subject({
            name,
            grade,
            curriculumId: curriculumId || undefined,
            teacherId: teacherId || undefined,
            lessons: [],
            books: []
        });

        const savedSubject = await newSubject.save();
        res.status(201).json({ message: "Subject created successfully", subject: savedSubject });
    } catch (error) {
        res.status(400).json({ message: "Error creating subject", error: error.message });
    }
};

// @desc    Update a subject
// @route   PUT /admin/subjects/:id
const updateSubject = async (req, res) => {
    try {
        const { name, grade, curriculumId, teacherId } = req.body;

        const subject = await Subject.findById(req.params.id);
        if (!subject) return res.status(404).json({ message: "Subject not found" });

        if (name) subject.name = name;
        if (grade) subject.grade = grade;
        if (curriculumId !== undefined) subject.curriculumId = curriculumId;
        if (teacherId !== undefined) subject.teacherId = teacherId;

        const updatedSubject = await subject.save();
        res.json({ message: "Subject updated successfully", subject: updatedSubject });
    } catch (error) {
        res.status(400).json({ message: "Error updating subject", error: error.message });
    }
};

// @desc    Delete a subject
// @route   DELETE /admin/subjects/:id
const deleteSubject = async (req, res) => {
    try {
        const subject = await Subject.findByIdAndDelete(req.params.id);
        if (!subject) return res.status(404).json({ message: "Subject not found" });

        res.json({ message: "Subject deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting subject", error: error.message });
    }
};

// @desc    Add a lesson to a subject
// @route   POST /admin/subjects/:id/lessons
const addLesson = async (req, res) => {
    try {
        const { title, description, date, contents } = req.body;

        const subject = await Subject.findById(req.params.id);
        if (!subject) return res.status(404).json({ message: "Subject not found" });

        subject.lessons.push({ title, description, date, contents: contents || [] });
        await subject.save();

        res.status(201).json({ message: "Lesson added successfully", subject });
    } catch (error) {
        res.status(400).json({ message: "Error adding lesson", error: error.message });
    }
};

// @desc    Update a lesson
// @route   PUT /admin/subjects/:id/lessons/:lessonId
const updateLesson = async (req, res) => {
    try {
        const { title, description, date, contents } = req.body;

        const subject = await Subject.findById(req.params.id);
        if (!subject) return res.status(404).json({ message: "Subject not found" });

        const lesson = subject.lessons.id(req.params.lessonId);
        if (!lesson) return res.status(404).json({ message: "Lesson not found" });

        if (title) lesson.title = title;
        if (description !== undefined) lesson.description = description;
        if (date) lesson.date = date;
        if (contents) lesson.contents = contents;

        await subject.save();
        res.json({ message: "Lesson updated successfully", subject });
    } catch (error) {
        res.status(400).json({ message: "Error updating lesson", error: error.message });
    }
};

// @desc    Delete a lesson
// @route   DELETE /admin/subjects/:id/lessons/:lessonId
const deleteLesson = async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id);
        if (!subject) return res.status(404).json({ message: "Subject not found" });

        const lesson = subject.lessons.id(req.params.lessonId);
        if (!lesson) return res.status(404).json({ message: "Lesson not found" });

        subject.lessons.pull({ _id: req.params.lessonId });
        await subject.save();

        res.json({ message: "Lesson deleted successfully", subject });
    } catch (error) {
        res.status(500).json({ message: "Error deleting lesson", error: error.message });
    }
};

module.exports = {
    getSubjects,
    getSubjectById,
    createSubject,
    updateSubject,
    deleteSubject,
    addLesson,
    updateLesson,
    deleteLesson
};
