import {config as conf} from "dotenv";

conf ();

const _config = {
    prot: process.env.PORT,
    databseURL: process.env.MONGO_CONNECTION_STRING,
    env: process.env.NODE_ENV,
    jwtSecret: process.env.JWT_SECRET,
    cloudinaryCloud: process.env.CLOUDYNARY_CLOUD,
    cloudinaryApiKey: process.env.CLOUDYNARY_KEY,
    cloudinarySecret: process.env.CLOUDYNARY_SECRET,
    frontedDomain: process.env.FRONTED_DOMAIN,
};



export const config = Object.freeze(_config);