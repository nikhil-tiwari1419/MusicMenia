require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/Database/db')



connectDB();

app.listen(3000, () => {
    console.log("Server is runningon port 3k")
})
