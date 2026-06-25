const mongoose  = require('mongoose');

const likedSongSchema = new mongoose.Schema({
    userId:{ 
        type:mongoose.Schema.Types.ObjectId,
        ref:'use',
        required: true
    },
    songId:{
         type: mongoose.Schema.Types.ObjectId,
         ref:'song',
         required:true,
    },
    likedAt:{
        type:Date,
        default:Date.now
    }
});

likedSongSchema.index({ userId:1, songId:1}, {unique:true});

module.exports = mongoose.model('likedSong', likedSongSchema);


