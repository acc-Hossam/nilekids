const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admins = require("../Model/Admin");
const Teacher = require("../Model/TeacherSchema");
const Student = require("../Model/StudentSchema");

// Login Route
router.post("/login", async (req, res) => {
    const { username, password, role } = req.body;

    try {
        let user;

        if (role === "admin") {
            user = await Admins.findOne({ username });
        } else if (role === "teacher") {
            user = await Teacher.findOne({ username });
        } else if (role === "student") {
            user = await Student.findOne({ userName: username });
        }

        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id, role: role },
            process.env.JWT_SECRET,
            { expiresIn: "100d" }
        );
        console.log(token);
        res.json({ token, role: role, userId: user._id, name: user.name });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;