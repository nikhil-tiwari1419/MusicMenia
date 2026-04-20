const express = require('express');
const authcontroller = require('../controllers/auth.controller');
const { authUser } = require('../middlewares/auth.middleware');
const validationRules = require('../middlewares/validation.middelware');
const { registerLimiter, otpLimiter, loginLimiter, forgotLimiter } = require('../limiters/auth.limiter');
// const userModel = require('../models/user.model');
// const bcrypt = require('bcryptjs');

const router = express.Router();

router.post('/register',registerLimiter,validationRules.registerUserValidationRules, authcontroller.registerUser);
router.post('/verify-email',otpLimiter, authcontroller.verifyEmail);
router.post('/login',loginLimiter, authcontroller.loginUser);
router.post('/logout', authcontroller.logOut);
router.post('/forgot-password',forgotLimiter, authcontroller.forgotPassword);
router.post('/reset-password',otpLimiter, authcontroller.resetPassword);
router.get('/is-auth', authUser, authcontroller.IsAuth);
router.post('/refresh-token', authcontroller.refreshAccessToken);

// router.post('/setup-admin', async(req,res)=>{
//     try {
//         const { secret } = req.body;

//         if (secret !== process.env.ADMIN_SETUP_SECRET){
//             return res.status(403).json({ message: "Forbidden" });
//         }

//         const existing = await userModel.findOne({ role: "admin" });
//         if (existing){
//             return res.status(400).json({ message :" Admin already exist"});
//         }

//         const hash = await bcrypt.hash(process.env.ADMIN_INIT_PASSWORD, 10);
//         await userModel.create({
//             username:"admin",
//             email: process.env.ADMIN_INIT_EMAIL,
//             password : hash,
//             role: 'admin',
//             isVerified: true,
//         });

//         res.status(201).json({ message : "Admin create succesfully"});
//     } catch (error) {
//         res.status(500).json({ message: error.message});
//     }
// });

module.exports = router;

