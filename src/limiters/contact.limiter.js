const rateLimiter = require('express-rate-limit')
const { submitContactForm } = require('../controllers/contact.controller')


const numberOfIssueCreate = rateLimiter({
    windowMs: 24 * 60 * 60 * 1000,
    max: 1,
    message: { message: "You can only make 1 message per day" }
})

module.exports = { numberOfIssueCreate }