const musicModel = require('../models/music.model');
const albumModel = require('../models/album.model');;
const { uploadFile, uploadThumbnail } = require('../services/storage.service');


async function createMusic(req, res) {
    try {
        const { title } = req.body;
        const audioFile = req.files?.audio?.[0];
        const PhotoFile = req.files?.thumbnail?.[0];

        if (!audioFile) {
            return res.status(400).json({
                message: "Audio files is requied"
            });
        }
        // if(!PhotoFile){
        //     return res.status(400).json({
        //         message:"Thumbnail is required"
        //     });
        // }

        const audioResult = await uploadFile(audioFile.buffer.toString('base64'))

        let thumbnailUrl = "null";
        if (PhotoFile) {
            const photoResult = await uploadThumbnail(PhotoFile.buffer.toString('base64'))
            thumbnailUrl = photoResult.url;
        }



        const music = await musicModel.create({
            url: audioResult.url,
            thumbnail: thumbnailUrl,
            title,
            artist: req.user.id,
        })


        res.status(201).json({
            message: "Music created successfully",
            music: {
                id: music._id,
                url: music.url,
                thumbnail: music.thumbnail,
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
    const album = await albumModel.findById(albumId).populate('artist', 'username email').populate('musics');
    return res.status(200).json({
        message: "Album music fetch succesfully",
        album: album,
    })
}

async function deleteMusic(req, res) {
    try {
        const musicId = req.params.musicId;
        const userId = req.user.id;

        // find the music 
        const music = await musicModel.findById(musicId);

        if (!music) {
            return res.status(404).json({
                message: "Music not found",
            });
        }
        if (music.artist.toString() !== userId) {
            return res.status(403).json({
                message: "You are not authorized to delete this music",
            });
        }

        await musicModel.findByIdAndDelete(musicId);
        return res.status(200).json({
            message: "Music deleted successfully",
        })
    } catch (error) {
        console.log("Delete Music Error: ", error);
        return res.status(500).json({
            message: "Server error",
        });
    }
}

module.exports = { createMusic, createAlbum, getAllMusic, getAllAlbum, getAlbumById, deleteMusic }

