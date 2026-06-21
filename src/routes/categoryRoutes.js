const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getAllCategories,
    getCategoryById,
    getCategoryBySlug,
    createCategory,
    updateCategory,
    deleteCategory,
} = require('../controllers/categoryController');

router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.get('/slug/:slug', getCategoryBySlug);

router.use(protect);
router.post('/', authorize('super_admin'), createCategory);
router.put('/:id', authorize('super_admin'), updateCategory);
router.delete('/:id', authorize('super_admin'), deleteCategory);

module.exports = router;