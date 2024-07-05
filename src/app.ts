import express from "express";
import globalErrorHandlers from "./middlewares/globalErrorHandlers";
import userRouter from "./user/userRouter";


const app = express();

app.use(express.json());

// Routes
//Http method : GET, POST, PUT, PATCH, DELETE
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.get('/', (req, res, next) => {
    
    res.json({message: "Hi there, what's going on there..."});
    
});

app.use("/api/users" ,userRouter);

// Global error handler
// Middleware

app.use(globalErrorHandlers);

export default app;