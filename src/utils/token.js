const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const RefreshToken = require('../models/refreshToken.model');

//Access Token - short lived 15 min 
function generateAccessToken(user) {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    );
}

//Refresh tokne - longl ived 7 days 
async function generateRefreshToken(userId){
    const token = uuidv4();

    await RefreshToken.create({
        token,
        userId,
    });
    return token;
}

module.exports = { generateAccessToken , generateRefreshToken};


