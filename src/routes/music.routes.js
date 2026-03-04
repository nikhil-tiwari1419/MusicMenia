const express = require('express');
const multer = require('multer');
const authMiddleware = require('../middlewares/auth.middleware')
const musicController = require('../controllers/music.controller');


const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload-music", authMiddleware.authArtist, upload.single('file'), musicController.createMusic);

router.post('/upload-album', authMiddleware.authArtist, musicController.createAlbum)

router.get('/get-music', authMiddleware.authUser, musicController.getAllMusic)

router.get('/get-album', authMiddleware.authUser, musicController.getAllAlbum)

router.get('/get-album/:albumId',authMiddleware.authUser, musicController.getAlbumById)

router.delete('/delete-music',authMiddleware.authArtist, )
module.exports = router;

