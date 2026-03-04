const jwt = require('jsonwebtoken');
const BlacklistToken = require('../models/blacklistingToken.model')

async function authArtist(req, res, next) {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: 'UnAuthorized' })
    }
    //Adding black listed check
    const isBlackListed = await BlacklistToken.findOne({ token });
    if (isBlackListed) {
        return res.status(401).json({ message: "Token is Invalid, please login again" });
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "artist") {
            return res.status(403).json({
                message: "Access denied , You don't have access to create an album.."
            });
        }
        req.user = decoded; // ADD passes Artist info to controler 
        next();

    } catch (error) {
        console.log(error)
        return res.status(401).json({
            message: "Invalid token , Artist UnAuthorized"
        });
    }
}

async function authUser(req, res, next) {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "UnAuthorised"
        })
    }

    //Adding blacklisted check
    const isBlacklisted = await BlacklistToken.findOne({ token });
    if(isBlacklisted){
       return res.status(401).json({
            message:"Token is invalid , please login again"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "user" && decoded.role !== 'artist') {
            return res.status(403).json({
                message: "login first as user/admin to see the MusicFeed locally"
            })
        }
        req.user = decoded;
        next();


    } catch (error) {
        console.log(error)
        return res.status(401).json({
            message: "UnAuthorised"
        })

    }
}

module.exports = { authArtist, authUser };
