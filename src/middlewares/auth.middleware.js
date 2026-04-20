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
    if (isBlacklisted) {
        return res.status(401).json({
            message: "Token is invalid , please login again"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const validRoles = ["user", "artist", "admin"];

        if (!validRoles.includes(decoded.role)) {
            return res.status(403).json({
                message: "Unauthorized role"
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

async function authAdmin(req, res, next) {
    
    try {
        
        const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const isBlacklisted = await BlacklistToken.findOne({ token });
    if (isBlacklisted) {
        return res.status(401).json({ message: "Token invalid, please login again" });
    }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admin only." });
        }
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }

}

module.exports = { authArtist, authUser, authAdmin };

