const express = require("express");
const dotenv = require('dotenv');
const cors = require('cors');
const router = express.Router();
const connectDB = require("./db/configconection")
//import mongoose 
const app = express();
//config dotenv
dotenv.config();
const port = process.env.PORT;
//import mongoose
const { authMiddleware, authorizeRoles } = require("./Middleware/auth.js");

connectDB()
app.use(express.json());
//import routes

app.use("/", (req, res) => {
    res.send("Hello from homepage ");
})




//use routes



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});