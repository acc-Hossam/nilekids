const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
    name: { type: String, default: "Default Admin" },
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" }
}, { timestamps: true });

// hook لتشفير الباسورد قبل الحفظ

;

module.exports = mongoose.model("Admins", adminSchema);