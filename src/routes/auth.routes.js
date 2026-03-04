const express = require('express');
const authcontroller = require('../controllers/auth.controller');
const { authUser } = require('../middlewares/auth.middleware')


const router = express.Router();

router.post('/regester', authcontroller.regesterUser)
router.post('/login', authcontroller.loginUser)
router.post('/logout', authcontroller.logOut)
router.get('/is-auth',authUser, authcontroller.IsAuth,)


module.exports = router;


