import express, { NextFunction, Request, Response } from "express";
import globalErrorHandlers from "./middlewares/globalErrorHandlers";
import userRouter from './user/userRouter';
import bookRouter from './book/bookRouter';
import cors from "cors";
import { config } from "./config/config";


const app = express();

app.use(cors({
    origin: config.frontedDomain,
}));

app.use(express.json());

// Routes
//Http method : GET, POST, PUT, PATCH, DELETE
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.get('/', (req: Request, res:Response, next: NextFunction) => {
    
    res.json({message: "Hi there, what's going on there..."});
    
});

app.use("/api/users" ,userRouter);
app.use("/api/books" ,bookRouter);

// Global error handler
// Middleware

app.use(globalErrorHandlers);

export default app;