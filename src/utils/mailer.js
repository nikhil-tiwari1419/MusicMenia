const axios = require('axios');

//  Common Inline Styles (works in all email clients) 
const S = {
    wrapper: `max-width:500px;margin:auto;font-family:Arial,sans-serif;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;background:#ffffff;`,
    header: `background:#7c3aed;color:white;padding:15px;text-align:center;font-size:22px;font-weight:bold;`,
    body: `padding:25px;`,
    h2: `margin:0 0 15px;color:#111827;font-size:20px;`,
    h3: `margin:0 0 15px;color:#111827;font-size:18px;`,
    p: `color:#4b5563;line-height:1.6;margin:0 0 12px;`,
    otp: `font-size:36px;font-weight:bold;color:#3b82f6;letter-spacing:8px;text-align:center;margin:20px 0;`,
    songTitle: `color:#10b981;font-size:20px;font-weight:bold;margin:10px 0 4px;`,
    alertSuccess: `background:#dcfce7;color:#166534;padding:12px;border-radius:6px;margin:15px 0;`,
    alertWarning: `background:#fef9c3;color:#854d0e;padding:12px;border-radius:6px;margin:15px 0;`,
    btnPurple: `display:inline-block;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:bold;color:white;background:#7c3aed;`,
    btnGreen: `display:inline-block;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;color:white;background:#10b981;`,
    cta: `text-align:center;margin-top:25px;`,
    footer: `text-align:center;padding:12px;background:#f9fafb;color:#6b7280;font-size:12px;`,
    footerNote: `color:#666;font-size:12px;margin-top:20px;`,
};

//  Base Template 
function emailTemplate(bodyHTML) {
    return `
    <div style="${S.wrapper}">
        <div style="${S.header}">🎵 MusicMenia</div>
        <div style="${S.body}">${bodyHTML}</div>
        <div style="${S.footer}">© ${new Date().getFullYear()} MusicMenia</div>
    </div>`;
}

//  Core Sender 
const sendEmail = async ({ to, subject, html }) => {
    try {
        await axios.post('https://api.brevo.com/v3/smtp/email', {
            sender: { name: 'MusicMenia', email: process.env.BREVO_SENDER_EMAIL },
            to: [{ email: to }],
            subject,
            htmlContent: html
        }, {
            headers: {
                'api-key': process.env.BREVO_API_KEY,
                'Content-Type': 'application/json'
            }
        });
    } catch (err) {
        console.error('❌ Email failed:', err.response?.data || err.message);
        throw err;
    }
};

//  Welcome Email 
async function sendWelcomeEmail(email, username) {
    await sendEmail({
        to: email,
        subject: "Welcome to MusicMenia! 🎵",
        html: emailTemplate(`
            <h2 style="${S.h2}">Welcome ${username}! 🎉</h2>
            <p style="${S.p}">We're excited to have you on MusicMenia.</p>
            <p style="${S.p}">Discover, create, and share music with the world! 🎶</p>
        `)
    });
}

//  OTP Email 
async function sendOTPEmail(email, otp, purpose = "verify") {
    const subjects = {
        verify: "Verify your Email - MusicMenia",
        forgot: "Reset Password OTP - MusicMenia",
    };

    await sendEmail({
        to: email,
        subject: subjects[purpose],
        html: emailTemplate(`
            <h2 style="${S.h2}">Your OTP Code</h2>
            <p style="${S.p}">Use the OTP below to ${purpose} your account:</p>
            <div style="${S.otp}">${otp}</div>
            <p style="${S.p}">This OTP expires in <strong>10 minutes</strong>.</p>
            <p style="${S.p}">If you didn't request this, ignore this email.</p>
        `)
    });
}

//  Login Email 
async function sendLoginEmail(email, username) {
    await sendEmail({
        to: email,
        subject: "New Login Detected - MusicMenia",
        html: emailTemplate(`
            <h2 style="${S.h2}">Hey ${username}! 👋</h2>
            <p style="${S.p}">Login successful 🎉</p>
            <p style="${S.p}">A new login was detected on your MusicMenia account.</p>
            <div style="${S.alertWarning}">
                ⚠️ If this wasn't you, reset your password immediately.
            </div>
        `)
    });
}

//  Logout Email 
async function sendLogoutEmail(email, username) {
    await sendEmail({
        to: email,
        subject: "Logged Out - MusicMenia",
        html: emailTemplate(`
            <h2 style="${S.h2}">Hey ${username}! 👋</h2>
            <p style="${S.p}">You have been successfully logged out of MusicMenia.</p>
            <p style="${S.p}">See you soon! 🎵</p>
        `)
    });
}

//  Password Reset Email 
async function sendPasswordResetEmail(email, username) {
    await sendEmail({
        to: email,
        subject: "Password Reset Successful - MusicMenia",
        html: emailTemplate(`
            <h3 style="${S.h3}">Hi ${username}, 👋</h3>
            <p style="${S.p}">Your password has been changed successfully.</p>
            <div style="${S.alertSuccess}">✅ Password Updated</div>
            <p style="${S.p}">If you didn't make this change, contact support immediately.</p>
            <div style="${S.cta}">
                <a href="${process.env.CLIENT_URL}/Profile"
                   style="${S.btnPurple}"
                   target="_blank" rel="noopener">
                    Go to Account
                </a>
            </div>
        `)
    });
}

//  New Music Email 
async function sendNewMusicEmail(email, username, artistName, songTitle) {
    try {
        await sendEmail({
            to: email,
            subject: `New Music by ${artistName} 🎵 - MusicMenia`,
            html: emailTemplate(`
                <h2 style="${S.h2}">Hey ${username}! 🎧</h2>
                <p style="${S.p}">A new track just dropped on MusicMenia!</p>
                <p style="${S.songTitle}">${songTitle}</p>
                <p style="${S.p}">by <strong>${artistName}</strong></p>
                <div style="${S.cta}">
                    <a href="${process.env.CLIENT_URL}/Local-feed"
                       style="${S.btnGreen}">
                        Listen Now 🎵
                    </a>
                </div>
                <p style="${S.footerNote}">
                    You're receiving this because you're a MusicMenia member.
                </p>
            `)
        });
    } catch (error) {
        console.error(`sendNewMusicEmail failed for ${email}:`, error.message);
        throw error;
    }
}

async function sendContactFormNotification(contact) {
    try {
        await sendEmail({
            to: process.env.BREVO_SENDER_EMAIL,
            subject: `New Contact-form Message: ${contact.subject}`,
            html: emailTemplate(` 
                  <h2 style="${S.h2}">New message from the Contact Form</h2>
                <p style="${S.p}"><strong>Name:</strong> ${contact.username}</p>
                <p style="${S.p}"><strong>Email:</strong> ${contact.email}</p>
                <p style="${S.p}"><strong>Subject:</strong> ${contact.subject}</p>
                <p style="${S.p}"><strong>Message:</strong></p>
                <p style="${S.p}">${contact.message}</p>
                `)
        })
    } catch (error) {
        console.error('sendContactFormNotification failed: ', error.message);
        throw error;
    }
}


async function sendContactfromConfermation(contact){
    try {
        await sendEmail({
            to : contact.email,
            subject: "We received Your message = MusicMenia",
            html: emailTemplate(`
                <h2 style="${S.h2}">Thanks for reaching out, ${contact.username}! 🎵</h2>
                <p style="${S.p}">We've received your message and will get back to you within 24–48 hours.</p>
                <p style="${S.p}"><strong>Your message:</strong></p>
                <p style="${S.p}">${contact.message}</p>
                `)

        })
    } catch (error) {
        console.error('sendContactFormConfirmation failed:', error.message);
        throw error;
        
    }
}


module.exports = {
    sendWelcomeEmail,
    sendOTPEmail,
    sendLoginEmail,
    sendLogoutEmail,
    sendPasswordResetEmail,
    sendNewMusicEmail,
    sendContactFormNotification,
    sendContactfromConfermation
};

