const express = require('express');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth.routes');
const musicRoutes = require('./routes/music.routes');
const cors = require('cors')

const app = express();

app.use(cors({
origin: process.env.CLIENT_URL || 'http://localhost:5173',
credentials :true,
}));

app.use(express.json());
app.use(cookieParser());


app.get("/", (req,res)=>res.send("Api is working"))
app.use('/api/auth', authRouter);
app.use('/api/music', musicRoutes);

module.exports = app

