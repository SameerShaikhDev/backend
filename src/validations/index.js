const { body, param, query } = require('express-validator');

// Auth validations
const registerValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),

    body('phone')
        .trim()
        .notEmpty().withMessage('Phone number is required')
        .matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid Indian phone number'),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email'),

    body('password')
        .notEmpty().withMessage('Password is required'),
];

// Category validations
const createCategoryValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required')
        .isLength({ max: 100 }).withMessage('Category name cannot exceed 100 characters'),

    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
];

const updateCategoryValidation = [
    body('name')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('Category name cannot exceed 100 characters'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
];

// Mantra validations
const createMantraValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Mantra name is required'),

    body('benefits')
        .trim()
        .notEmpty().withMessage('Benefits are required')
        .isLength({ max: 1000 }).withMessage('Benefits cannot exceed 1000 characters'),

    body('categoryId')
        .notEmpty().withMessage('Category ID is required')
        .isMongoId().withMessage('Invalid category ID'),

    body('howToChant')
        .optional()
        .isLength({ max: 1000 }).withMessage('How to chant cannot exceed 1000 characters'),

    body('bestTime')
        .optional()
        .isLength({ max: 200 }).withMessage('Best time cannot exceed 200 characters'),

    body('recommendedCount')
        .optional()
        .isInt({ min: 1 }).withMessage('Recommended count must be a positive integer'),
];

const updateMantraValidation = [
    body('name')
        .optional()
        .trim(),

    body('benefits')
        .optional()
        .isLength({ max: 1000 }).withMessage('Benefits cannot exceed 1000 characters'),

    body('categoryId')
        .optional()
        .isMongoId().withMessage('Invalid category ID'),

    body('howToChant')
        .optional()
        .isLength({ max: 1000 }).withMessage('How to chant cannot exceed 1000 characters'),

    body('bestTime')
        .optional()
        .isLength({ max: 200 }).withMessage('Best time cannot exceed 200 characters'),

    body('recommendedCount')
        .optional()
        .isInt({ min: 1 }).withMessage('Recommended count must be a positive integer'),

    body('isFeatured')
        .optional()
        .isBoolean().withMessage('isFeatured must be a boolean'),
];

// Shloka validations
const createShlokaValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Shloka name is required'),

    body('sanskrit')
        .trim()
        .notEmpty().withMessage('Sanskrit text is required'),

    body('meaning')
        .trim()
        .notEmpty().withMessage('Meaning is required')
        .isLength({ max: 1000 }).withMessage('Meaning cannot exceed 1000 characters'),

    body('mantraId')
        .notEmpty().withMessage('Mantra ID is required')
        .isMongoId().withMessage('Invalid mantra ID'),

    body('order')
        .optional()
        .isInt({ min: 0 }).withMessage('Order must be a non-negative integer'),
];

const updateShlokaValidation = [
    body('name')
        .optional()
        .trim(),

    body('sanskrit')
        .optional()
        .trim(),

    body('meaning')
        .optional()
        .isLength({ max: 1000 }).withMessage('Meaning cannot exceed 1000 characters'),

    body('order')
        .optional()
        .isInt({ min: 0 }).withMessage('Order must be a non-negative integer'),
];

// Admin validations
const createAdminValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email'),

    body('phone')
        .trim()
        .notEmpty().withMessage('Phone number is required')
        .matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid Indian phone number'),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

    body('role')
        .optional()
        .isIn(['admin', 'super_admin']).withMessage('Role must be admin or super_admin'),
];

// ID param validation
const idParamValidation = [
    param('id')
        .isMongoId().withMessage('Invalid ID format'),
];

const slugParamValidation = [
    param('slug')
        .notEmpty().withMessage('Slug is required'),
];

// Pagination validation
const paginationValidation = [
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer'),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
];

module.exports = {
    registerValidation,
    loginValidation,
    createCategoryValidation,
    updateCategoryValidation,
    createMantraValidation,
    updateMantraValidation,
    createShlokaValidation,
    updateShlokaValidation,
    createAdminValidation,
    idParamValidation,
    slugParamValidation,
    paginationValidation,
};