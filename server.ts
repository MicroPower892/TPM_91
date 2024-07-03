import app from './src/app';
import { config } from './src/config/config';

const startServer = async () => {


    const port = config.prot || 4000;

    app.listen(port, () => {
        console.log(`Listener on port: ${port}`);
    });
};

startServer();