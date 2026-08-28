const express = require('express')
const authcontroller = require('../controllers/auth.controller')
const { authUser } = require('../middlewares/auth.middleware')

const router  = express.Router()

router.get('/get-artist', authUser,authcontroller.HowManyArtist)

module.exports = router;

