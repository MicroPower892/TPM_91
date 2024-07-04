import {config as conf} from "dotenv";

conf();

const _config = {
    prot: process.env.PORT,
    databseURL: process.env.MONGO_CONNECTION_STRING,
    env: process.env.NODE_ENV,
    
};


export const config = Object.freeze(_config);