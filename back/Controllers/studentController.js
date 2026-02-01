const Student = require("../Model/Student");
const addStudent = async (req, res) => {
    try {
        // const student = new Student(req.body);
        // await student.save();
        // res.status(201).json(student);
        console.log("hello");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// const getStudents = async (req, res) => {
//     try {
//         const students = await Student.find();
//         res.status(200).json(students);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
// const getStudentById = async (req, res) => {
//     try {
//         const student = await Student.findById(req.params.id);
//         res.status(200).json(student);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
// const updateStudent = async (req, res) => {
//     try {
//         const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         res.status(200).json(student);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
// const deleteStudent = async (req, res) => {
//     try {
//         const student = await Student.findByIdAndDelete(req.params.id);
//         res.status(200).json(student);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
module.exports = {
    addStudent

};