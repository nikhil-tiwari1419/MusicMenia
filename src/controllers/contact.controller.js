const contactModel = require('../models/contact.model');
const userModel = require('../models/user.model')
const { sendContactFormNotification, sendContactfromConfermation } = require('../utils/mailer')

async function submitContactForm(req, res) {
    try {
        const { username, subject, message } = req.body;

        if (!username || !message) {
            return res.status(400).json({
                message: "Username and message are required."
            });
        }

        const userId = req.user._id || req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const userDoc = await userModel.findById(userId).select('email');
        if (!userDoc) {
            return res.status(404).json({
                message: "User account not found."
            });
        }

        const contact = await contactModel.create({
            username,
            email: userDoc.email,
            subject: subject || 'General',
            message,
            user: userId,
        });

        // Email Notification
        // here we use first notification and backend process parallel
        try {
            sendContactFormNotification(contact).catch(err => console.error('sendContactFormNotification failed:', err.message));
            sendContactfromConfermation(contact).catch(err => console.error('sendContactFormconfermation', err.message));

        } catch (emailError) {
            console.error('contact form email notification failed:', emailError.message)
        }

        res.status(201).json({
            email: userDoc.email,
            message: 'Message recived succesfully',
            contactId: contact._id
        });

    } catch (error) {
        console.log(error)
        console.error('Contact form error:', error);
        res.status(500).json({ message: 'Something went wrong . Please try again leter' });

    }
}

module.exports = { submitContactForm };

