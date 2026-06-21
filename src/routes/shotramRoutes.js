const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getAllShotrams,
    getShotramsByCategory,
    getShotramById,
    getShotramBySlug,
    incrementShotramViews,
    createShotram,
    updateShotram,
    deleteShotram,
} = require('../controllers/shotramController');

router.get('/', getAllShotrams);
router.get('/category/:categoryId', getShotramsByCategory);
router.get('/slug/:slug', getShotramBySlug); // FIXED: slug route MUST be before /:id
router.get('/:id', getShotramById);
router.post('/:id/views', incrementShotramViews);

router.use(protect);
router.post('/', authorize('admin', 'super_admin'), createShotram);
router.put('/:id', authorize('admin', 'super_admin'), updateShotram);
router.delete('/:id', authorize('admin', 'super_admin'), deleteShotram);

module.exports = router;