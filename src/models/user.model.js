const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'artist'],
        default: 'user',
    },
    isVerified: {
        type: Boolean,
        default: false
    }
})

const userModel = mongoose.model('user', userSchema)

module.exports = userModel;