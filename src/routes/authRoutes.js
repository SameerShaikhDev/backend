const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { uploadSingle } = require('../middleware/uploadMiddleware');
const {
    register,
    login,
    verifyEmail,
    forgotPassword,
    resetPassword,
    getProfile,
    updateProfile,
    changePassword,
    logout,
    refreshToken,
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

router.use(protect);
router.get('/profile', getProfile);
router.put('/profile', uploadSingle('avatar'), updateProfile);
router.put('/change-password', changePassword);

module.exports = router;