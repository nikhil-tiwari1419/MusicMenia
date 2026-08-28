const express = require('express');
const multer = require('multer');
const authMiddleware = require('../middlewares/auth.middleware')
const musicController = require('../controllers/music.controller');
const { createAlbumLimiter, createMusicLimiter } = require('../limiters/music.limiter');
const { AviodDoubleMusic } = require('../utils/DublicateMusic');

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'audio' && !file.mimetype.startsWith('audio')) {
            return cb(new Error('Only audio files allowed'));
        }
        if (file.fieldname === 'thumbnail' && !file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files allowed'));
        }
        cb(null, true);
    }
});

router.post(
    "/upload-music",
    authMiddleware.authArtist,
    upload.fields([
        { name: 'audio', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 }
    ]), AviodDoubleMusic, musicController.createMusic);

router.post('/upload-album', authMiddleware.authArtist, musicController.createAlbum)

router.get('/get-music', authMiddleware.authUser, musicController.getAllMusic)

router.get('/my-music', authMiddleware.authArtist, musicController.getMyMusic)

router.get('/get-album', authMiddleware.authUser, musicController.getAllAlbum)

router.get('/get-album/:albumId', authMiddleware.authUser, musicController.getAlbumById)

router.delete('/delete-music/:musicId', authMiddleware.authArtist, musicController.deleteMusic)


module.exports = router;

