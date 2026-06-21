const Shotram = require('../models/Shotram');
const Category = require('../models/Category');
const generateSlug = require('../utils/generateSlug');

exports.getAllShotrams = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query = { isActive: true };
        if (req.query.category) query.category = req.query.category;

        const shotrams = await Shotram.find(query)
            .populate('category', 'name slug')
            .sort({ order: 1, createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Shotram.countDocuments(query);

        res.status(200).json({
            success: true,
            data: shotrams,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.getShotramsByCategory = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const shotrams = await Shotram.find({ category: req.params.categoryId, isActive: true })
            .sort({ order: 1 })
            .skip(skip)
            .limit(limit);

        const total = await Shotram.countDocuments({ category: req.params.categoryId, isActive: true });

        res.status(200).json({
            success: true,
            data: shotrams,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.getShotramById = async (req, res) => {
    try {
        const shotram = await Shotram.findById(req.params.id)
            .populate('category', 'name slug');

        if (!shotram) {
            return res.status(404).json({ success: false, message: 'Shotram not found' });
        }

        res.status(200).json({ success: true, data: shotram });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.getShotramBySlug = async (req, res) => {
    try {
        const shotram = await Shotram.findOne({ slug: req.params.slug })
            .populate('category', 'name slug');

        if (!shotram) {
            return res.status(404).json({ success: false, message: 'Shotram not found' });
        }

        res.status(200).json({ success: true, data: shotram });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.incrementShotramViews = async (req, res) => {
    try {
        const shotram = await Shotram.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        );

        if (!shotram) {
            return res.status(404).json({ success: false, message: 'Shotram not found' });
        }

        res.status(200).json({ success: true, message: 'View counted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.createShotram = async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
            return res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
        }

        const {
            name, sanskrit, kannada, marathi, tamil, hindi, english,
            meaning, audioUrl, category, order, isFeatured
        } = req.body;

        const slug = generateSlug(name);

        const existingShotram = await Shotram.findOne({ slug });
        if (existingShotram) {
            return res.status(400).json({ success: false, message: 'Shotram slug already exists' });
        }

        const shotram = await Shotram.create({
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

        res.status(201).json({ success: true, message: 'Shotram created', data: shotram });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.updateShotram = async (req, res) => {
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

            const existingShotram = await Shotram.findOne({
                _id: { $ne: req.params.id },
                slug: updateData.slug,
            });
            if (existingShotram) {
                return res.status(400).json({ success: false, message: 'Shotram slug already exists' });
            }
        }

        const shotram = await Shotram.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!shotram) {
            return res.status(404).json({ success: false, message: 'Shotram not found' });
        }

        res.status(200).json({ success: true, message: 'Shotram updated', data: shotram });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.deleteShotram = async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
            return res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
        }

        const shotram = await Shotram.findByIdAndDelete(req.params.id);
        if (!shotram) {
            return res.status(404).json({ success: false, message: 'Shotram not found' });
        }

        res.status(200).json({ success: true, message: 'Shotram deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};