import e from "express";

const app = e();

app.use(e.json());

const requestLogger = (req, res, next) => {
    console.log(`${req.method} request made to: ${req.url}`);
    next(); // Moves to the next middleware or route handler
};

app.use(requestLogger)

app.post('/register',(req,res)=>{
    res.send(`Your data ${JSON.stringify(req.body)}`)
})

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));