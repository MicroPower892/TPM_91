import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import fs from "node:fs";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import { AuthRequest } from "../middlewares/authenticate";



// Create the book...


const createBook = async (req:Request, res:Response, next:NextFunction) => {
    const {title, genre} = req.body;

   
   const files = req.files as {[fieldname: string]: Express.Multer.File[]};

   // 'application/pdf'

   const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
   const fileName = files.coverImage[0].filename;
   
   const filePath = path.resolve(__dirname, '../../public/data/uploads', fileName);


   
try {


    const uploadResult = await cloudinary.uploader.upload(filePath, {
        filename_override: fileName,
        folder: "book-covers",
        format: coverImageMimeType,
       });
    
    
    
       //
    
       const bookFileName = files.file[0].filename;
       
       const bookFilePath = path.resolve(__dirname, '../../public/data/uploads', bookFileName);
    



    const bookFileUploadResult = await cloudinary.uploader.upload(bookFilePath, {

        resource_type: "raw",
        filename_override: bookFileName,
        folder: "book-pdfs",
        format: "pdf",


    });

   
        const _req = req as AuthRequest;


        // creating the book

        const newBook = await bookModel.create({
            title,
            genre,
            author: _req.userId,
            coverImage: uploadResult.secure_url,
            file: bookFileUploadResult.secure_url,
        });


        // Delete the temp files

        // todo: try catch Error Handling....

        await fs.promises.unlink(filePath);
        await fs.promises.unlink(bookFilePath);



        res.status(201).json({ id: newBook._id });


    } catch(err) {

        console.log(err);
        return next(createHttpError(500, "Error while uploading the files!"));

    }

   

};



// Update the book...


const updateBook = async (req:Request, res:Response, next:NextFunction) => {

    const {title, genre} = req.body;

    const bookId = req.params.bookId;

    const book  = await bookModel.findOne( { _id: bookId } );

    if (!book) {
        return next(createHttpError(404, "Book not found!"));
    }


    //Access check

    const _req = req as AuthRequest;

    if (book.author.toString() !== _req.userId) {
        return next(createHttpError(403, "You can not update other books!"));
    }


    // Check if the image field is exist!

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    let completeCoverImage = "";

    if (files.coverImage){

        const filename = files.coverImage[0].filename;
        const coverMimeType = files.coverImage[0].mimetype.split("/").at(-1);

        // send file to cloudinary
 
        const filePath = path.resolve(
            __dirname,
            "../../public/data/uploads/" + filename
        );

        completeCoverImage = filename;
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            filename_override: completeCoverImage,
            folder: "book-covers",
            format: coverMimeType,
        });

        completeCoverImage = uploadResult.secure_url;
        await fs.promises.unlink(filePath);

    }


    // check if file fieled is exist

    let comepleteFilename = "";
    if (files.file) {
        const bookFilePath = path.resolve(
            __dirname,
            "../../public/data/uploads/" + files.file[0].filename
        );


        const bookFileName = files.file[0].filename;
        comepleteFilename = bookFileName;

        const uploadResultPdf = await cloudinary.uploader.upload(bookFileName, {
            resource_type: "raw",
            filename_override: comepleteFilename,
            folder: "book-pdfs",
            format: "pdf",
        });


        comepleteFilename = uploadResultPdf.secure_url;
        await fs.promises.unlink(bookFilePath);


    }

    const updateBook = await bookModel.findOneAndUpdate(
        {
            _id: bookId,
        },
        {
            title: title,
            genre: genre,
            coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
            file: comepleteFilename ? comepleteFilename : book.file,

        },
        { new: true }
    );

    res.json(updateBook);

    

};



// List the book...

const listBooks = async (req: Request, res: Response, next: NextFunction) => {
    // const sleep = await new Promise((resolve) => setTimeout(resolve, 5000));

    try {
        // todo: add pagination.
        const book = await bookModel.find();
        res.json(book);
    } catch (err) {
        return next(createHttpError(500, "Error while getting a book"));
    }
};



// Get the single book...


const getSingleBook = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const bookId = req.params.bookId;

    try {
        const book = await bookModel.findOne({ _id: bookId });
            // populate author field
            
        if (!book) {
            return next(createHttpError(404, "Book not found."));
        }

        return res.json(book);
    } catch (err) {
        return next(createHttpError(500, "Error while getting a book"));
    }
};


// Delete the single book...


const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
    const bookId = req.params.bookId;

    const book = await bookModel.findOne({ _id: bookId });
    if (!book) {
        return next(createHttpError(404, "Book not found"));
    }

    // Check Access
    const _req = req as AuthRequest;
    if (book.author.toString() !== _req.userId) {
        return next(createHttpError(403, "You can not update others book."));
    }
    // book-covers/dkzujeho0txi0yrfqjsm
    // https://res.cloudinary.com/degzfrkse/image/upload/v1712590372/book-covers/u4bt9x7sv0r0cg5cuynm.png

    const coverFileSplits = book.coverImage.split("/");
    const coverImagePublicId =
        coverFileSplits.at(-2) +
        "/" +
        coverFileSplits.at(-1)?.split(".").at(-2);

    const bookFileSplits = book.file.split("/");
    const bookFilePublicId =
        bookFileSplits.at(-2) + "/" + bookFileSplits.at(-1);
    console.log("bookFilePublicId", bookFilePublicId);

    // todo: add try error block
    await cloudinary.uploader.destroy(coverImagePublicId);
    await cloudinary.uploader.destroy(bookFilePublicId, {
        resource_type: "raw",
    });

    await bookModel.deleteOne({ _id: bookId });

    return res.sendStatus(204);
};




export { createBook, updateBook, listBooks, getSingleBook, deleteBook };


