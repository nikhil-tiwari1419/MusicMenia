const express = require('express');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth.routes');
const musicRoutes = require('./routes/music.routes');
const cors = require('cors')

const app = express();

app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            process.env.CLIENT_URL,
            'http://localhost:5173'
        ].filter(Boolean); // Filter out any undefined values

        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CROS'));
        }
    },
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());


app.get("/", (req, res) => res.send("Api is working"))
app.use('/api/auth', authRouter);
app.use('/api/music', musicRoutes);

module.exports = app


