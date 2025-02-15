import mongoose from "mongoose";
import express from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import bcrypt from "bcryptjs";

dotenv.config();


const app = express();
app.use(express.json());


const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: { type: String, default: "user" } // Default role is 'user'
});

mongoose.connect('mongodb://127.0.0.1:27017/akshat', {
    useNewUrlParser: true,
    // useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));


const User = mongoose.model("User", userSchema);

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid token." });
    }

};

const roleMiddleware = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: "Access denied" });
    }
    next();
};


//For Admins only
app.get("/admin", authMiddleware, roleMiddleware(['admin']), (req, res) => {
    res.json({ message: "Welcome Admin!" });
});

//Users with role defined
app.get("/users", async (req, res) => {
    const { role } = req.query;
    const users = await User.find(role ? { role } : {});
    res.json(users);
});

// Register an Admin User
app.post("/register-admin", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create admin user
        const adminUser = new User({
            name,
            email,
            password: hashedPassword,
            role: "admin"  // Assign admin role
        });

        await adminUser.save();

        res.status(201).json({ message: "Admin user registered successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// register users (no admin)
app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create admin user
        const adminUser = new User({
            name,
            email,
            password: hashedPassword,
            role: "user"  // Assign admin role
        });

        await adminUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//Login
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//delete user
app.delete("/users/:id", async (req,res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

//Sort Users
app.get("/users/sort", async (req, res) => {
    const { sortBy = "name", order = "asc" } = req.query;
    const users = await User.find().sort({ [sortBy]: order === "desc" ? -1 : 1 });
    res.json(users);
});

//Pagination and set Limit
app.get("/users/page", async (req, res) => {
    const { page = 1, limit = 5 } = req.query;
    const users = await User.find()
        .skip((page - 1) * limit)
        .limit(Number(limit));
    res.json(users);
});


const PORT = process.env.PORT || 3000;;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));