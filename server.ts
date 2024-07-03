import app from './src/app';

const startServer = async () => {


    const port = process.env.PORT || 4000;

    app.listen(port, () => {
        console.log(`Listener on port: ${port}`);
    });
};

startServer();