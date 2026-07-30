const crypto = require("crypto");
const musicModel = require('../models/music.model')

async function AviodDoubleMusic(req, res, next) {
    try {
        const audioFile = req.files?.audio?.[0];

      if(!audioFile){
        return res.status(400).json({
            message:"Audio file is required"
        });
      }

        // generate a finger print of the audio file
        const fileHash = crypto.createHash('sha256').update(audioFile.buffer).digest('hex');

        // check db for dublicate 
        const existingSong = await musicModel.findOne({ fileHash });
        if (existingSong) {
            return res.status(409).json({
                message: "This song already exists",
                song: existingSong,
            });
        }

        // attach hash so createmuasic 
        req.fileHash = fileHash;
        next();
    
    } catch (error) {
        console.error("AvoidDoubleMusic error", error);
        return res.status(500).json({
            message: "Server error hashiing audioo file ",
            error: error.message
        });
    }
}

module.exports = { AviodDoubleMusic }