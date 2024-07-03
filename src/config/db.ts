import mongoose from "mongoose";
import { config } from "./config";


const connectDB = async () => {

    try {

        mongoose.connection.on('connected', () => {
            console.log("Connected sucessfully with database...");
        });

        mongoose.connection.on('error', (err) => {
            console.log("Error to connecting with database....", err);
        });

        await mongoose.connect(config.databseURL as string);


        

    } catch(err) {

        console.error("Failed to connect to the database....", err);

        process.exit(1);

    }
    
};

export default connectDB;