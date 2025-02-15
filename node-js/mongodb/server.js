import e from "express";
import mongoose from "mongoose";

const app = e();
app.use(e.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/mydatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB Connection Error:", err));

// Define a Mongoose Schema (User Model)
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number
});

const User = mongoose.model("User", userSchema);

//Create
app.post("/users", async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//Read
app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Update
app.put("/users/:id", async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//Delete
app.delete("/users/:id", async (req,res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));