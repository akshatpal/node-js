import dotenv from 'dotenv';
dotenv.config(); // Load environment variables at the beginning

import bcrypt from 'bcryptjs';
import express from "express";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/akshat', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password") || !this.password) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const User = mongoose.model("User", userSchema);

//Register
app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "User already exists" });

        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Check all users
app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


//Token Authentication
const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Access denied" });

    try {
        const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
};
app.get("/profile", authMiddleware, async (req, res) => {
    const user = await User.findById(req.user.userId).select("-password");
    res.json(user);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
