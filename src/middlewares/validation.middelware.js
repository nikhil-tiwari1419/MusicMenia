const { body, check, validationResult } = require('express-validator');
const { registerUser } = require('../controllers/auth.controller');

async function validateResult(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    next();
}

const registerUserValidationRules = [
    body("username")
        .isString()
        .withMessage("Username Must be a String")
        .isLength({ min: 3, max: 20 })
        .withMessage("Username must be between 3 and 20 characters"),

    body("email")
        .isEmail()
        .withMessage("Inavald email address"),


    body("password")
        .isLength({ min: 13, max: 20 })
        .withMessage("password must be at least 6 character long")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least 1 uppercase leatter")
        .matches(/[a-z]/)
        .withMessage("password must conatain 1 lowercase letter")
        .matches(/[0-9]/)
        .withMessage("password must conatain at least 1 number")
        .matches(/[@$!%*&]/)
        .withMessage("password must conatin at least 1 special character"),

    validateResult

]


module.exports = { registerUserValidationRules };

