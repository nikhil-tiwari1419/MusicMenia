const musicModel = require('../models/music.model');
const albumModel = require('../models/album.model');
const { sendNewMusicEmail } = require('../utils/mailer')
const { uploadFile, uploadThumbnail } = require('../services/storage.service');
const { notify } = require('../routes/music.routes');
const userModel = require('../models/user.model');
const { promises } = require('nodemailer/lib/xoauth2');


async function createMusic(req, res) {
    try {
        const { title } = req.body;
        const audioFile = req.files?.audio?.[0];
        const PhotoFile = req.files?.thumbnail?.[0];

        if (!title || !title.trim()) {
            return res.status(400).json({ message: "Title is required " });
        }
        if (!audioFile) {
            return res.status(400).json({ message: "Audio files is requied " });
        }

        const audioResult = await uploadFile(audioFile.buffer.toString('base64'))

        let thumbnailUrl = null;
        if (PhotoFile) {
            const photoResult = await uploadThumbnail(PhotoFile.buffer.toString('base64'))
            thumbnailUrl = photoResult.url;
        }

        const music = await musicModel.create({
            url: audioResult.url,
            thumbnail: thumbnailUrl,
            title,
            artist: req.user.id,
        });

        res.status(201).json({
            message: "Music created successfully",
            music: {
                id: music._id,
                url: music.url,
                thumbnail: music.thumbnail,
                title: music.title,
                artist: music.artist,
            }
        });

        notifyAllUsers(req.user.id, title).catch(err =>
            console.log('Music Notificatiobn failed ', err)
        );

    } catch (error) {
        console.log("Create Music Error: ", error);
        res.status(500).json({
            message: "Server error"
        });
    }
}

async function notifyAllUsers(artistId, songTitle) {
    try {
        const artist = await userModel.findById(artistId).select('username');
        const users = await userModel.find({
            isVerified: true,
            _id: { $ne: artistId },
            role: { $in: ['user', 'artist'] }
        }).select('email username');

        console.log(`Notefying ${users.length} users about: ${songTitle}`);

        const batchSize = 10;
        for (let i = 0; i < user.length; i += batchSize) {
            const batch = users.slice(i, i + batchSize);

            await promise.allsettled(
                batch.map(user =>
                    sendNewMusicEmail(
                        user.email,
                        user.username,
                        artistData.username,
                        songTitle
                    )));
            //Samll delay between batches

            if (i + batchSize < user.length) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        console.log(`Notification complete for: ${songTitle}`);
    } catch (error) {
        console.error('notifyAllUsers error:', error);
    }
}

async function createAlbum(req, res) {

    try {

        const { title, musicsId } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "Album title is required"
            });
        }

        if (!musicsId || !Array.isArray(musicsId) || musicsId.length === 0) {
            return res.status(400).json({
                message: "At least one music ID is required"
            });
        }

        // verify all music belong to artist 
        const musics = await musicModel.find({ _id: { $in: musicsId }, artist: req.user.id });
        if (musics.length !== musicsId.length) {
            return res.status(403).json({
                message: "Some music IDs are invalid or don't belong to you"
            });
        }
        const album = await albumModel.create({
            title,
            artist: req.user.id,
            musics: musicsId,
        })
        return res.status(201).json({
            message: "Album created succesfully",
            album: {
                id: album.id,
                title: album.title,
                artist: album.artist,
                musics: album.musics,
            }
        });

    } catch (error) {
        console.error("Create Album Error: ", error);
        return res.status(500).json({
            message: "Server Error"
        })
    }
}

async function getAllMusic(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [musics, total] = await Promise.all([
            musicModel.find()
                .skip(skip)
                .limit(limit)
                .populate('artist', 'username email')
                .lean(), // to return a string 
            musicModel.countDocuments()
        ]);

        return res.status(200).json({
            message: "Music fetched Succesfully",
            musics,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        });
    } catch (error) {
        console.log("Get All Music Error: ", error);
        return res.status(500).json({
            message: "Server error"
        });
    }
}

async function getAllAlbum(req, res) {
    try {
        const album = await albumModel.find().select('title artist').populate("artist", "username email")
        res.status(200).json({
            message: " Album fetched successfully",
            album: album,
        })

    } catch (error) {
        console.error("Get All Album Error: ", error);
        return res.status(500).json({
            message: "Server error",
        });
    }
}

async function getAlbumById(req, res) {

    try {
        const albumId = req.params.albumId;
        const album = await albumModel.findById(albumId)
            .populate('artist', 'username email')
            .populate('musics');

        if (!album) {
            return res.status(404).json({
                message: "Album not found",
            });
        }

        return res.status(200).json({
            message: "Album fetched succesfully",
            album, // album fetched 
        })
    } catch (error) {
        console.log("Get Album By Id Error: ", error);
        return res.status(500).json({
            message: "Server error",
        });
    }
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

async function getMyMusic(req, res) {
    try {
        const artistId = req.user.id; // from jwt token

        const musics = await musicModel
            .find({ artist: artistId }) //only this artist music
            .populate('artist', 'username email')
            .sort({ _id: -1 }) //newest first
            .lean();

        return res.status(200).json({
            message: "Your Music fetch succesfully",
            musics,
        });
    } catch (error) {
        console.log("Get My Music:", error);
        return res.status(500).json({
            message: "Server error"
        });
    }
}

module.exports = { createMusic, createAlbum, getAllMusic, getMyMusic, getAllAlbum, getAlbumById, deleteMusic }

