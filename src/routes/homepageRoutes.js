const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getHero,
    updateHero,
    getDailyMantra,
    updateDailyMantra,
    getFeaturedMantras,
    updateFeaturedMantras,
    getSEO,
    updateSEO,
} = require('../controllers/homepageController');

router.get('/hero', getHero);
router.get('/daily-mantra', getDailyMantra);
router.get('/featured-mantras', getFeaturedMantras);
router.get('/seo', getSEO);

router.use(protect);
router.put('/hero', authorize('admin', 'super_admin'), updateHero);
router.put('/daily-mantra', authorize('admin', 'super_admin'), updateDailyMantra);
router.put('/featured-mantras', authorize('admin', 'super_admin'), updateFeaturedMantras);
router.put('/seo', authorize('admin', 'super_admin'), updateSEO);

module.exports = router;