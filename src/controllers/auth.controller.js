const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const BlacklistToken = require("../models/blacklistingToken.model");

//regester controller 
async function regesterUser(req, res) {

    try {
        const { username, email, password, role = "user" } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const isUserAlreadyExists = await userModel.findOne({
            $or: [
                { username },
                { email }
            ]
        });

        if (isUserAlreadyExists) {
            return res.status(409).json({
                success: false,
                message: "user Already exist"
            });
        }

        const hash = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            username,
            email,
            password: hash,
            role
        });

        const token = jwt.sign({
            id: user._id,
            role: user.role,
        }, process.env.JWT_SECRET, { expiresIn: "1d" })

        res.cookie("token", token, {
            httpOnly: true,
        })

        res.status(201).json({
            message: "User regestered succesfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            }
        })

    } catch (error) {
        console.error("Register Error: ", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

// logIn controller
async function loginUser(req, res) {

    try {
        const { username, email, password } = req.body;
        if (!password || (!username && !email)) {
            return res.status(400).json({
                message: "Please provide username/email and passowrd"
            })
        }

        const user = await userModel.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        })

        if (!user) {
            return res.status(401).json({
                message: " Inavlid creadintial"
            })
        }


        const isPassowrdvalid = await bcrypt.compare(password, user.password)

        if (!isPassowrdvalid) {
            return res.status(401).json({
                message: "Invalid creanditial"
            })
        }

        const token = jwt.sign({
            id: user._id,
            role: user.role,
        }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.cookie('token', token, {
            httpOnly: true,
        })

        res.status(200).json({
            message: "User looged in Succesfulluy",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            }
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error"
        })
    }

}

// logOut controller
async function logOut(req, res) {

    try {
        const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(400).json({ message: "No token found" });
        }

        // BlacklistToken
        await BlacklistToken.findOneAndUpdate(
            { token },
            { token },
            { upsert: true, returnDocument: 'after' },
        );

        res.clearCookie('token');
        res.status(200).json({
            message: 'User looegout successfully'
        });


    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'logout failed', error: error.message
        });
    }
}

//Check if user Authinticated 
async function IsAuth (req,res) {
  try {
    const user = await userModel.findById(req.user.id).select('-password');

    if(!user){
        return res.status(400).json({
            message: "User not found"
        });
    }
    return res.status(200).json({
        success:true,
        user:{
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        }
    });
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(500).json({ success: false, message:"error hai is-auth api me ya IsAuth Controller me " ||error.message });
  }
}

module.exports = { regesterUser, loginUser, logOut, IsAuth }

