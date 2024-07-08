import express from "express";
import { createBook, updateBook, listBooks, getSingleBook, deleteBook } from "./bookController";
import multer from "multer";
import path from "node:path";
import authenticate from "../middlewares/authenticate";



const bookRouter = express.Router();


// file store local -->>

const upload = multer({
    dest: path.resolve(__dirname, '../../public/data/uploads'),
    // todo: put limit 10 MB MAX
    limits: {fileSize: 3e7},    // 30mb == 30*1024*1024
})


//Routes
// /api/books

bookRouter.post("/",authenticate, upload.fields([
    { name: "coverImage", maxCount: 1},
    { name: "file", maxCount: 1},
]), createBook);


bookRouter.patch("/:bookId",authenticate, upload.fields([
    { name: "coverImage", maxCount: 1},
    { name: "file", maxCount: 1},
]), updateBook);

bookRouter.get("/", listBooks);


bookRouter.get("/:bookId", getSingleBook);


bookRouter.delete("/:bookId", authenticate, deleteBook);


export default bookRouter;