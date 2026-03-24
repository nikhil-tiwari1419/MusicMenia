const rateLimit = require('express-rate-limit');
const { registerUser } = require('../controllers/auth.controller');

const loginLimiter = rateLimit({ // 15 min
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { message: "To many login request attemps! Try after 15 minutes" }
});

const registerLimiter = rateLimit({ //30 min
    windowMs: 30 * 60 * 1000,
    max: 18,
    message: { message: "Too many account created! Try afetr 30 after" }
});

const otpLimiter = rateLimit({ // 10 min
    windowMs: 10 * 60 * 1000,
    max: 3,
    message: { message: "Too many OTP attempts! Try after 10 minutes" }
});

const forgotLimiter = rateLimit({ // 30 min 
    windowMs: 30 * 60 * 1000,
    max: 3,
    message: { message: "Too Many requests! Try after 30 minutes " }
});

module.exports = { loginLimiter, registerLimiter, otpLimiter,forgotLimiter};

