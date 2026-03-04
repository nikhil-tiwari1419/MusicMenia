const { ImageKit } = require('@imagekit/nodejs')

const imageKit = new ImageKit({
    privatekey: process.env.IMAGEKIT_PRIVATE_KEY,
})

async function uploadFile(file) {
    const result = await imageKit.files.upload({
        file,
        fileName: "music_" + Date.now(),
        folder: "yt-complet-backend/music"
    })
    return result;
}

module.exports = { uploadFile }

