const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadSingle } = require('../middleware/uploadMiddleware');
const {
  getAllMantras,
  getFeaturedMantras,
  getDailyMantra,
  getPopularMantras,
  getMantrasByCategory,
  getMantraById,
  getMantraBySlug,
  incrementMantraViews,
  createMantra,
  updateMantra,
  deleteMantra,
} = require('../controllers/mantraController');

router.get('/', getAllMantras);
router.get('/featured', getFeaturedMantras);
router.get('/daily', getDailyMantra);
router.get('/popular', getPopularMantras);
router.get('/category/:categoryId', getMantrasByCategory);
router.get('/slug/:slug', getMantraBySlug); // FIXED: slug route MUST be before /:id
router.get('/:id', getMantraById);
router.post('/:id/views', incrementMantraViews);

router.use(protect);
router.post('/', authorize('admin', 'super_admin'), uploadSingle('image'), createMantra);
router.put('/:id', authorize('admin', 'super_admin'), uploadSingle('image'), updateMantra);
router.delete('/:id', authorize('admin', 'super_admin'), deleteMantra);

module.exports = router;