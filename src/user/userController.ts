import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from 'bcrypt';
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";
import { create } from "domain";




    // Create User


const createUser = async (req:Request, res:Response, next:NextFunction) => {
    const {name, email, password} = req.body;
    //Validation
    if (!name || !email || !password) {
        const error = createHttpError(400, "All Filed is requred!!");
        return next(error);
    }   


    //Database call

    try {

        const user = await userModel.findOne({email});

        if (user) {
            const error = createHttpError(400, "User already exists with this email...");
            next(error);
        }

    } catch (err) {
        return next(createHttpError(500, "Error has been occured while usere created!"));
    }

    

    //password >> hash
    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser: User;


    try {

         newUser = await userModel.create({
            name,
            email,
            password: hashedPassword,
        });

    } catch (err) {

        return next(createHttpError(500, "Error has been occured while usere created!"));

    }



    try {

        // Token generation JWT
    const token = sign({sub: newUser._id}, config.jwtSecret as string, {expiresIn: '7d', algorithm: "HS256"} );

    //Process
    //Response
    res.status(201).json({ message: "User Created Successfully!", accessToken: token });

    } catch(error) {
        return next(createHttpError(500, "Error while signing with JWT token!"));
    }
    

};



    // Login User



const loginUser = async (req:Request, res:Response, next:NextFunction) => {
    const { email, password } = req.body;   // get the user data from DB there


    // validation

    if ( !email || !password ) {
        return next(createHttpError(400, "All field are required!"));
    }

    // Check that user are exist or not there


    // todo: wrap in try cath there

    const user = await userModel.findOne({email});

    if (!user) {
        return next(createHttpError(404, "User not found!"));

    }

    // Match the user data there

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
        return next(createHttpError(400, "Username and Password is an incorrect!"));
    }



    // todo: handle errors

    // create access token

    const token = sign({sub: user._id}, config.jwtSecret as string, {expiresIn: '7d', algorithm: "HS256"} );


    res.json({ message: "User Login Successfully!" ,accessToken: token});




};

export { createUser, loginUser };