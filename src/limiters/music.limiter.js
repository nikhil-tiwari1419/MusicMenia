const rateLimiter = require('express-rate-limit')
const { createAlbum, createMusic } = require('../controllers/music.controller')

const createMusicLimiter = rateLimiter({
    windowMs: 24 * 60 * 60 * 1000,
    max: 2,
    message: { message: "You can only upload 2 Music a Day " }
});


const createAlbumLimiter = rateLimiter({
    windowMs: 24 * 60 * 60 * 1000,
    max: 2,
    message: { message: "You can only create only 2 Album a Day" }
});

module.exports = { createAlbumLimiter, createMusicLimiter }
