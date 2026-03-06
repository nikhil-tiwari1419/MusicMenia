const userModel = require('../models/user.model');
const OTPModel = require('../models/otp.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const BlacklistToken = require("../models/blacklistingToken.model");
const { sendWelcomeEmail, sendOTPEmail, sendLoginEmail, sendLogoutEmail } = require('../utils/mailer');


// generate otp 6 digit OTP 
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

//register controller 
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
            role,
            isVerified: false
        });

        //send Welcome + verify OTP
        await sendWelcomeEmail(email, username);
        const otp = generateOTP();
        await OTPModel.create({ email, otp, purpose: 'verify' });
        await sendOTPEmail(email, otp, 'verify');

        res.status(201).json({
            message: "Regesterd! Please verify Your emial with the OTP sent",
            // userId: user._id
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

//verify email otp
async function verifyEmail(req, res) {
    try {
        const { email, otp } = req.body;

        const otpRecord = await OTPModel.findOne({ email, otp, purpose: 'verify' });
        if (!otpRecord) {
            return res.status(400).json({
                message: "Invalid or expire OTP"
            });
        }

        await userModel.findOneAndUpdate({ email }, { isVerified: true });
        await OTPModel.deleteMany({ email, purpose: 'verify' });

        res.status(200).json({
            message: "Email Verifyed succesfully! You can now login "
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Server Error"
        });
    }
}

// LOGIN  controller
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

        // is email verifyed ? 
        if (!user.isVerified) {
            //Resend OTP if Not Verified 
            const otp = generateOTP();
            await OTPModel.deleteMany({ email: user.email, purpose: 'verify' });
            await OTPModel.create({ email: user.email, otp, purpose: 'verify' });
            await sendOTPEmail(user.email, otp, 'verify');

            return res.status(403).json({
                message: "Email not verified. New OTP sent to your email.",
            });
        }
        // Direct login -JWT token
        const token = jwt.sign({
            id: user._id,
            role: user.role,
        }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.cookie('token', token, {
            httpOnly: true,
        });

        // Login notification email
        await sendLoginEmail(user.email, user.username);

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

        // Send Logout Notification
        const decoded = jwt.decode(token);
        const user = await userModel.findById(decoded.id);
        if (user) await sendLogoutEmail(user.email, user.username);


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

// FORGOT PASSWORD - Send OTP
async function forgotPassword(req, res) {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const otp = generateOTP();
        await OTPModel.deleteMany({ email, purpose: 'forgot' });
        await OTPModel.create({ email, otp, purpose: 'forgot' });
        await sendOTPEmail(email, otp, 'forgot');

        res.status(200).json({ message: "OTP sent to your email" });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

// RESET PASSWORD
async function resetPassword(req, res) {
    try {
        const { email, otp, newPassword } = req.body;

        const otpRecord = await OTPModel.findOne({ email, otp, purpose: 'forgot' });
        if (!otpRecord) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        const hash = await bcrypt.hash(newPassword, 10);
        await userModel.findOneAndUpdate({ email }, { password: hash });
        await OTPModel.deleteMany({ email, purpose: 'forgot' });

        res.status(200).json({ message: "Password reset successfully!" });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}


//Check if user Authinticated 
async function IsAuth(req, res) {
    try {
        const user = await userModel.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }
        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            }
        });
    } catch (error) {
        console.error('Auth check error:', error);
        res.status(500).json({ success: false, message: "error hai is-auth api me ya IsAuth Controller me " || error.message });
    }
}

module.exports = { regesterUser, verifyEmail, logOut, loginUser, forgotPassword, resetPassword, IsAuth }

