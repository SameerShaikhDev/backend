const Category = require('../models/Category');
const Mantra = require('../models/Mantra');
const generateSlug = require('../utils/generateSlug');

exports.getAllCategories = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query = { isActive: true };
        if (req.query.search) {
            query.name = { $regex: req.query.search, $options: 'i' };
        }

        const categories = await Category.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Category.countDocuments(query);

        res.status(200).json({
            success: true,
            data: categories,
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

exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        res.status(200).json({ success: true, data: category });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.getCategoryBySlug = async (req, res) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug });
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        res.status(200).json({ success: true, data: category });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.createCategory = async (req, res) => {
    try {
        if (req.user.role !== 'super_admin') {
            return res.status(403).json({ success: false, message: 'Access denied. Super admin only.' });
        }

        const { name, description, image } = req.body;
        const slug = generateSlug(name);

        const existingCategory = await Category.findOne({ $or: [{ name }, { slug }] });
        if (existingCategory) {
            return res.status(400).json({ success: false, message: 'Category name already exists' });
        }

        const category = await Category.create({
            name,
            slug,
            description,
            image: image || null,
            createdBy: req.user.id,
        });

        res.status(201).json({ success: true, message: 'Category created', data: category });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        if (req.user.role !== 'super_admin') {
            return res.status(403).json({ success: false, message: 'Access denied. Super admin only.' });
        }

        const { name, description, isActive, image } = req.body;
        const updateData = { description, isActive };
        if (image !== undefined) updateData.image = image;

        if (name) {
            updateData.name = name;
            updateData.slug = generateSlug(name);

            const existingCategory = await Category.findOne({
                _id: { $ne: req.params.id },
                $or: [{ name }, { slug: updateData.slug }],
            });
            if (existingCategory) {
                return res.status(400).json({ success: false, message: 'Category name already exists' });
            }
        }

        const category = await Category.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        res.status(200).json({ success: true, message: 'Category updated', data: category });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        if (req.user.role !== 'super_admin') {
            return res.status(403).json({ success: false, message: 'Access denied. Super admin only.' });
        }

        const mantrasInCategory = await Mantra.findOne({ category: req.params.id });
        if (mantrasInCategory) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete category with associated mantras. Remove mantras first.',
            });
        }

        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        res.status(200).json({ success: true, message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};