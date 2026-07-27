require("dotenv").config();
const app = require('./src/app');
const connectDB = require('./src/Database/db')

const PORT =  3000;

async function startServer(){
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT} http://localhost:${PORT}`)
        })
    } catch (error) {
        console.error("Error starting server:", error);
        process.exit(1);
    }
}

startServer();

