const express = require('express');
const { submitContactForm } = require('../controllers/contact.controller')
const { authUser } = require('../middlewares/auth.middleware')
const { numberOfIssueCreate } = require('../limiters/contact.limiter')

const router = express.Router();

router.post('/new', numberOfIssueCreate, authUser, submitContactForm)
module.exports = router;

