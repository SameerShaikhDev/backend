const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getAllAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    blockAdmin,
    unblockAdmin,
} = require('../controllers/adminController');

// All routes require authentication and super_admin role
router.use(protect);
router.use(authorize('super_admin'));

router.get('/all', getAllAdmins);
router.post('/create', createAdmin);
router.put('/:id', updateAdmin);
router.delete('/:id', deleteAdmin);
router.post('/:id/block', blockAdmin);
router.post('/:id/unblock', unblockAdmin);

module.exports = router;