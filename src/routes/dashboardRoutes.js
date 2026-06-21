const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getStats,
    getTopMantras,
    getTopShlokas,
    getUserAnalytics,
    getReadAnalytics,  // Add this import
} = require('../controllers/dashboardController');

router.use(protect);
router.use(authorize('admin', 'super_admin'));

router.get('/stats', getStats);
router.get('/top-mantras', getTopMantras);
router.get('/top-shlokas', getTopShlokas);
router.get('/user-analytics', getUserAnalytics);
router.get('/read-analytics', getReadAnalytics);  // Add this route

module.exports = router;