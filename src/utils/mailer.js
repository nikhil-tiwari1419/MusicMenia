const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    }
});

async function sendWelcomeEmail(email, username) {
    await transporter.sendMail({
        from: `"MusicMenia" <${process.env.SMTP_USER}>`,
        to: email,  // ✅ lowercase
        subject: "Welcome to MusicMenia! 🎵",
        html: `
          <h2>Welcome ${username}!</h2>
          <p>We're excited to have you on MusicMenia.</p>
          <p>Discover, Create and share music with the world! 🎶</p>
        `
    });
}

async function sendOTPEmail(email, otp, purpose = "verify") {
    const subjects = {
        verify: "Verify your Email - MusicMenia",
        forgot: "Reset Password OTP - MusicMenia",
    };

    await transporter.sendMail({
        from: `"MusicMenia" <${process.env.SMTP_USER}>`,
        to: email,
        subject: subjects[purpose],
        html: `
          <h2>Your OTP Code</h2>
          <p>Use the OTP below to ${purpose} your account:</p>
          <h1 style="color:#3b82f6; letter-spacing:8px">${otp}</h1>
          <p>This OTP expires in <strong>10 minutes</strong>.</p>
          <p>If you didn't request this, ignore this email.</p>
        `
    });
}

async function sendLoginEmail(email, username) {
    await transporter.sendMail({
        from: `"MusicMenia" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "New Login Detected - MusicMenia",
        html: `
          <h2>Hey ${username}!</h2>
          <p>A new login was detected on your MusicMenia account.</p>
          <p>If this wasn't you, reset your password immediately.</p>
        `
    });
}

async function sendLogoutEmail(email, username) {
    await transporter.sendMail({
        from: `"MusicMenia" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Logged Out - MusicMenia",
        html: `
          <h2>Hey ${username}!</h2>
          <p>You have been successfully logged out of MusicMenia.</p>
          <p>See you soon! 🎵</p>
        `
    });
}

// ✅ sahi exports
module.exports = { sendWelcomeEmail, sendOTPEmail, sendLoginEmail, sendLogoutEmail };

