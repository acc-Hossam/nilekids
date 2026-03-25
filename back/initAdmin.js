const Admin = require("./Model/Admin");
const bcrypt = require("bcryptjs");

async function createDefaultAdmin() {
  try {
    const existingAdmin = await Admin.findOne({ username: "hossamhassan" });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("Allah@2020", 10);

      const admin = new Admin({
        name: "Default Admin",
        username: "admin",
        password: hashedPassword,
        role: "admin"
      });

      await admin.save();
      console.log("✅ Default admin created: userName=admin, password=admin");
    } else {
      console.log("ℹ️ Default admin already exists");
    }
  } catch (err) {
    console.error("Error creating default admin:", err.message);
  }
}

module.exports = createDefaultAdmin;