const { ImageKit } = require('@imagekit/nodejs')

const imageKit = new ImageKit({
    privatekey: process.env.IMAGEKIT_PRIVATE_KEY,
})

//for music
async function uploadFile(file) {
    const result = await imageKit.files.upload({
        file,
        fileName: "music_" + Date.now(),
        folder: "yt-complet-backend/music"
    })
    return result;
}

//for thumbnail
async function uploadThumbnail(file){
    const result = await imageKit.files.upload({
        file,
        filename:"thumbnail_"+ Date.now(),
        folder:"yt-complet-backend/thumbnails"
    })
    return result;
}

module.exports = { uploadFile, uploadThumbnail }
