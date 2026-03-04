const musicModel = require('../models/music.model');
const albumModel = require('../models/album.model');;
const { uploadFile } = require('../services/storage.service');


async function createMusic(req, res) {
    try {
        const { title } = req.body;
        const file = req.file;

        const result = await uploadFile(file.buffer.toString('base64'))

        const music = await musicModel.create({
            url: result.url,
            title,
            artist: req.user.id,
        })
        res.status(201).json({
            message: "Music created successfully",
            music: {
                id: music._id,
                url: music.url,
                title: music.title,
                artist: music.artist,
            }
        })

    } catch (error) {
        console.log("Create Music Error: ", error);

        res.status(500).json({
            message: "Server error"
        });
    }
}

async function createAlbum(req, res) {

    try {

        const { title, musicsId } = req.body;
        const album = await albumModel.create({
            title,
            artist: req.user.id,
            musics: musicsId,
        })
        res.status(201).json({
            message: "Album created succesfully",
            album: {
                id: album.id,
                title: album.title,
                artist: album.artist,
                musics: album.musics,
            }
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Server Error"
        })
    }
}

async function getAllMusic(req, res) {
    const musics = await musicModel
    .find()
    .skip(1)
    .limit(2)
    .populate('artist', 'username email')
    res.status(200).json({
        message: "Music fetchd succesfully",
        musics: musics
    })
}

async function getAllAlbum(req, res) {
    const album = await albumModel.find().select('title artist').populate("artist", "username email")
    res.status(200).json({
        message: " Album fetched successfully",
        album: album,
    })
}

async function getAlbumById(req, res) {
    const albumId = req.params.albumId;
    const album = await albumModel.findById(albumId).populate('artist' ,'username email').populate('musics');
    return res.status(200).json({
        message:"Album music fetch succesfully",
        album: album,
    })
}

module.exports = { createMusic, createAlbum, getAllMusic, getAllAlbum, getAlbumById }

