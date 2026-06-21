const express = require('express');
const router = express.Router();
const {
    globalSearch,
    searchMantras,
    searchShlokas,
    searchCategories,
} = require('../controllers/searchController');

router.get('/global', globalSearch);
router.get('/mantras', searchMantras);
router.get('/shlokas', searchShlokas);
router.get('/categories', searchCategories);

module.exports = router;