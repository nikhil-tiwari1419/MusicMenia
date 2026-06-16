// const { rejects } = require('assert');
const ffmpegStatic = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg')
const sharp = require('sharp');
const { Readable } = require('stream');

ffmpeg.setFfmpegPath(ffmpegStatic);

// Buffer -> Readable sream (ffmpeg needs stream input)
function bufferTostream(buffer) {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
}

// Audio Converter
//Any format -> mp3 64kbps
async function convertAudio(buffer) {
    return new Promise((resolve, reject) => {
        const chunks = [];

        ffmpeg(bufferTostream(buffer))
            .inputFormat('mp3')
            .audioCodec('libmp3lame')
            .audioBitrate('64k')
            .audioChannels(2)
            .audioFrequency(44100)
            .format('mp3')
            .on('error', (err) => {
                console.error('Audio conversion error:', err);
                reject(new Error('Audio conversion failed'));
            })
            .pipe()
            .on('data', chunk => chunks.push(chunk))
            .on('end', () => resolve(Buffer.concat(chunks)))
            .on('error', reject);
    });
}

// 
async function convertThumbnail(buffer) {
    try {
        const converted = await sharp(buffer)
            .resize(800, 800, {
                fit: 'cover',
                position: 'center'
            })
            .jpeg({ quality: 80 })
            .toBuffer();

        return converted;
    } catch (err) {
        console.log('Thumbnail conversion error: ', err);
        throw new Error('Thumbnail conversion failed');
    }
}

module.exports = { convertAudio, convertThumbnail }

