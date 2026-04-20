const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');

const authRouter = require('./routes/auth.routes');
const musicRoutes = require('./routes/music.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();
app.use(helmet());

app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [process.env.CLIENT_URL, 
            'http://localhost:5173'].filter(Boolean); // Filter out any undefined values

        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// // temporary debug — remove after fixing
// app.use((req, res, next) => {
//     console.log('PATH:', req.path);
//     console.log('COOKIES:', req.cookies);
//     next();
// });


app.get("/", (req, res) => res.send("Api is working"))
app.use('/api/auth', authRouter);
app.use('/api/music', musicRoutes);
app.use('/api/admin', adminRoutes);

// app.use((req,res,next)=>{
//     console.log("Cookies recived:", req.cookies);
//     next();
// });

app.use((err, req, res, next) => {
    console.error("Unhandeled Error", err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

module.exports = app


