const { validationResult, body } = require('express-validator');
const { ApiError } = require('../utils/ApiError');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => err.msg);
        throw new ApiError(400, errorMessages[0], errors.array());
    }
    next();
};

// Common validators
const userValidation = {
    register: [
        body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
        body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
        body('phone').matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid Indian phone number'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    ],
    login: [
        body('email').isEmail().withMessage('Please provide a valid email'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
};

module.exports = { validate, userValidation };