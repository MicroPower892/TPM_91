import express from "express";


const app = express();

// Routes
//Http method : GET, POST, PUT, PATCH, DELETE
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.get('/', (req, res, next) => {
    
    res.json({message: "Hi there, what's going on there..."});
    
});

export default app;