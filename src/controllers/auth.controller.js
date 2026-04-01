const userModel = require('../models/user.model');
const OTPModel = require('../models/otp.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const RefreshToken = require('../models/refreshToken.model')
const BlacklistToken = require("../models/blacklistingToken.model");
const { sendWelcomeEmail, sendOTPEmail, sendLoginEmail, sendLogoutEmail } = require('../utils/mailer');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');


// generate otp 6 digit OTP 
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
const isProduction = process.env.NODE_ENV === 'production';

//register controller 
async function registerUser(req, res) {

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
        const otp = generateOTP();
        await OTPModel.create({ email, otp, purpose: 'verify' });

        sendWelcomeEmail(email, username).catch(err => console.error('Welcome email faied:', err));;
        sendOTPEmail(email, otp, 'verify').catch(err => console.error('OTP email failed:', err));

        res.status(201).json({
            message: "Regesterd! Please verify Your emial with the OTP sent",
        });

        const token = jwt.sign({
            id: user._id,
            role: user.role,
        }, process.env.JWT_SECRET, { expiresIn: "1d" })

        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000
        })

        return res.status(201).json({
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
            message: "Error occurred while registering user"
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
                message: "Invalid or expired OTP"
            });
        }

        await userModel.findOneAndUpdate({ email }, { isVerified: true });
        await OTPModel.deleteMany({ email, purpose: 'verify' });

        res.status(200).json({
            message: "Email verified successfully! You can now login "
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
        });

        if (!user) {
            return res.status(401).json({
                message: " Inavlid creadintial , user not found with this username or email"
            });

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

            sendOTPEmail(user.email, otp, 'verify').catch(err => console.error(err));

            return res.status(403).json({
                message: "Email not verified. New OTP sent to your email.",
            });
        }


        // token creating system
        const accessToken = generateAccessToken(user);
        const refreshToken = await generateRefreshToken(user._id)

        //Acces  token 15 min
        res.cookie('token', accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 15 * 60 * 1000
        });

        //Refresh token in 7 days 
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: "Login successful!",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

        // background Login email notification 
        sendLoginEmail(user.email, user.username).catch(err => console.error(err));


    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error"
        })
    }

}

// REFRESH TOKEN — naya access token lo
async function refreshAccessToken(req, res) {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh token" });
        }

        // DB mein check karo
        const storedToken = await RefreshToken.findOne({ token: refreshToken }).populate('userId');

        if (!storedToken) {
            return res.status(401).json({ message: "Invalid refresh token, please login again" });
        }

        // Naya access token banao
        const newAccessToken = generateAccessToken(storedToken.userId);

        res.cookie('token', newAccessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 15 * 60 * 1000 // 15 min
        });

        res.status(200).json({ message: "Token refreshed!" });

    } catch (error) {
        res.status(500).json({ message: "Server error IN refresh token part " });
    }
}


// logOut controller
async function logOut(req, res) {

    try {
        const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
        const refreshToken = req.cookies?.refreshToken;

        if (!token) {
            return res.status(400).json({ message: "No token found" });
        }

        // BlacklistToken
        await BlacklistToken.findOneAndUpdate(
            { token },
            { token },
            { upsert: true, returnDocument: 'after' },
        );

        // Refresh token DB se delete karo
        if (refreshToken) {
            await RefreshToken.deleteOne({ token: refreshToken });
        }

        // Send Logout Notification
        const decoded = jwt.decode(token);
        const user = await userModel.findById(decoded.id);
        if (user) await sendLogoutEmail(user.email, user.username).catch(err => console.error(err));

        //dono cookies clear 
        res.clearCookie('token', {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
        });

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
        })

        res.status(200).json({
            message: 'User logout successfully'
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

module.exports = { registerUser, verifyEmail, logOut, loginUser, forgotPassword, resetPassword, IsAuth, refreshAccessToken }

