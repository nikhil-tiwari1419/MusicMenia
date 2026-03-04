const mongoose = require('mongoose')

const balckListingSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '1d'
    }
});

const blacklistModel = mongoose.model('BlacklistToken', balckListingSchema)

module.exports = blacklistModel

