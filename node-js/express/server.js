import e from "express";

const app = e();

app.get("/",(req,res) => {
    res.send("Hello Express.js");
})
app.get("/greet/:name",(req,res) => {
    const name = req.params.name;
    res.send(`Hello ${name}`);
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
app.get("/search", (req, res) => {
    const query = req.query.a;
    res.send(`You searched for: ${query}`);
});