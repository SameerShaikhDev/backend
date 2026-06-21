const Shloka = require('../models/Shloka');
const Mantra = require('../models/Mantra');
const Category = require('../models/Category');
const generateSlug = require('../utils/generateSlug');

exports.getAllShlokas = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query = { isActive: true };
        if (req.query.category) query.category = req.query.category;

        const shlokas = await Shloka.find(query)
            .populate('category', 'name slug')
            .sort({ order: 1, createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Shloka.countDocuments(query);

        res.status(200).json({
            success: true,
            data: shlokas,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.getShlokasByCategory = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const shlokas = await Shloka.find({ category: req.params.categoryId, isActive: true })
            .sort({ order: 1 })
            .skip(skip)
            .limit(limit);

        const total = await Shloka.countDocuments({ category: req.params.categoryId, isActive: true });

        res.status(200).json({
            success: true,
            data: shlokas,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// NEW: Get shlokas by mantra ID
// Shloka category se linked hai, mantra se nahi.
// Mantra ka category find karke us category ke shlokas return karte hain.
exports.getShlokasByMantra = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        // Step 1: Mantra find karo aur uska category lo
        const mantra = await Mantra.findById(req.params.mantraId).select('category name');
        if (!mantra) {
            return res.status(404).json({ success: false, message: 'Mantra not found' });
        }

        // Step 2: Us category ke shlokas fetch karo
        const shlokas = await Shloka.find({ category: mantra.category, isActive: true })
            .populate('category', 'name slug')
            .sort({ order: 1, createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Shloka.countDocuments({ category: mantra.category, isActive: true });

        res.status(200).json({
            success: true,
            data: shlokas,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.getShlokaById = async (req, res) => {
    try {
        const shloka = await Shloka.findById(req.params.id)
            .populate('category', 'name slug');

        if (!shloka) {
            return res.status(404).json({ success: false, message: 'Shloka not found' });
        }

        res.status(200).json({ success: true, data: shloka });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.getShlokaBySlug = async (req, res) => {
    try {
        const shloka = await Shloka.findOne({ slug: req.params.slug })
            .populate('category', 'name slug');

        if (!shloka) {
            return res.status(404).json({ success: false, message: 'Shloka not found' });
        }

        res.status(200).json({ success: true, data: shloka });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.incrementShlokaViews = async (req, res) => {
    try {
        const shloka = await Shloka.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        );

        if (!shloka) {
            return res.status(404).json({ success: false, message: 'Shloka not found' });
        }

        res.status(200).json({ success: true, message: 'View counted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.createShloka = async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
            return res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
        }

        const {
            name, sanskrit, kannada, marathi, tamil, hindi, english,
            meaning, audioUrl, category, order, isFeatured
        } = req.body;

        const slug = generateSlug(name);

        const existingShloka = await Shloka.findOne({ slug });
        if (existingShloka) {
            return res.status(400).json({ success: false, message: 'Shloka slug already exists' });
        }

        const shloka = await Shloka.create({
            name,
            slug,
            sanskrit,
            kannada,
            marathi,
            tamil,
            hindi: hindi || '',
            english: english || '',
            meaning: meaning || '',
            audioUrl: audioUrl || null,
            category,
            order: order || 0,
            isFeatured: isFeatured === 'true' || isFeatured === true,
            createdBy: req.user.id,
        });

        res.status(201).json({ success: true, message: 'Shloka created', data: shloka });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.updateShloka = async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
            return res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
        }

        const {
            name, sanskrit, kannada, marathi, tamil, hindi, english,
            meaning, audioUrl, category, order, isActive, isFeatured
        } = req.body;

        const updateData = {
            sanskrit, kannada, marathi, tamil, hindi, english,
            meaning, audioUrl, category, order, isActive, isFeatured
        };

        if (name) {
            updateData.name = name;
            updateData.slug = generateSlug(name);

            const existingShloka = await Shloka.findOne({
                _id: { $ne: req.params.id },
                slug: updateData.slug,
            });
            if (existingShloka) {
                return res.status(400).json({ success: false, message: 'Shloka slug already exists' });
            }
        }

        const shloka = await Shloka.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!shloka) {
            return res.status(404).json({ success: false, message: 'Shloka not found' });
        }

        res.status(200).json({ success: true, message: 'Shloka updated', data: shloka });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.deleteShloka = async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
            return res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
        }

        const shloka = await Shloka.findByIdAndDelete(req.params.id);
        if (!shloka) {
            return res.status(404).json({ success: false, message: 'Shloka not found' });
        }

        res.status(200).json({ success: true, message: 'Shloka deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};