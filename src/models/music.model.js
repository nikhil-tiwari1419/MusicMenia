const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        default: null,
    },
    title: {
        type: String,
        required: true,
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    fileHash: {
        type: String,
        required:true,
        unique: true,
    }
});

const musicModel = mongoose.model('music', musicSchema)

module.exports = musicModel

