const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['user', 'artist', 'admin'],
        default: 'user',
    },
    isVerified: {
        type: Boolean,
        default: false
    }
});

const userModel = mongoose.model('user', userSchema)

module.exports = userModel;

