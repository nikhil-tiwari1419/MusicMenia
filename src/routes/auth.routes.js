const express = require('express');
const authcontroller = require('../controllers/auth.controller');
const { authUser } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', authcontroller.regesterUser);
router.post('/verify-email', authcontroller.verifyEmail);
router.post('/login', authcontroller.loginUser);
router.post('/logout', authcontroller.logOut);
router.post('/forgot-password', authcontroller.forgotPassword);
router.post('/reset-password', authcontroller.resetPassword);
router.get('/is-auth', authUser, authcontroller.IsAuth);

module.exports = router;

