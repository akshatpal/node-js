import e from "express";

const app = e();

app.get("/about",(req,res) => {
    res.send("This is an Express app");
})
app.get("/square/:number",(req,res) => {
    const num = req.params.number;
    res.send(`${num*num}`);
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
app.get("/welcome", (req, res) => {
    const name = req.query.name;
    res.send(`You name is "${name}"`);
});