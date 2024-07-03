import app from './src/app';
import { config } from './src/config/config';
import connectDB from './src/config/db';

const startServer = async () => {

    await connectDB();

    const port = config.prot || 4000;

    app.listen(port, () => {
        console.log(`Listener on port: ${port}`);
    });
};

startServer();