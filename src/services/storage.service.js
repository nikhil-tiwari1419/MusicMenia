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
        fileName:"thumbnail_"+ Date.now(),
        folder:"yt-complet-backend/thumbnails"
    })
    return result;
}

// delete a file by its fileId ( works for both music and thubnail)
async  function deleteFile(fileId){
    const result = await imageKit.files.delete(fileId);
    return result;
}

module.exports = { uploadFile, uploadThumbnail, deleteFile }

