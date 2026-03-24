const express = require('express');
const authcontroller = require('../controllers/auth.controller');
const { authUser } = require('../middlewares/auth.middleware');
const validationRules = require('../middlewares/validation.middelware');
const { registerLimiter, otpLimiter, loginLimiter, forgotLimiter } = require('../limiters/auth.limiter');


const router = express.Router();

router.post('/register',registerLimiter,validationRules.registerUserValidationRules, authcontroller.registerUser);
router.post('/verify-email',otpLimiter, authcontroller.verifyEmail);
router.post('/login',loginLimiter, authcontroller.loginUser);
router.post('/logout', authcontroller.logOut);
router.post('/forgot-password',forgotLimiter, authcontroller.forgotPassword);
router.post('/reset-password',otpLimiter, authcontroller.resetPassword);
router.get('/is-auth', authUser, authcontroller.IsAuth);
router.post('/refresh-token', authcontroller.refreshAccessToken);

module.exports = router;

