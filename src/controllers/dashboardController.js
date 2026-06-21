const User = require('../models/User');
const Mantra = require('../models/Mantra');
const Shloka = require('../models/Shloka');
const Category = require('../models/Category');

exports.getStats = async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        const totalUsers = await User.countDocuments();
        const totalMantras = await Mantra.countDocuments();
        const totalShlokas = await Shloka.countDocuments();
        const totalCategories = await Category.countDocuments();
        const totalViews = await Mantra.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]);

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalMantras,
                totalShlokas,
                totalCategories,
                totalViews: totalViews[0]?.total || 0,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.getTopMantras = async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        const limit = parseInt(req.query.limit) || 10;
        const mantras = await Mantra.find()
            .sort({ views: -1 })
            .limit(limit)
            .populate('category', 'name');

        res.status(200).json({ success: true, data: mantras });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.getTopShlokas = async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        const limit = parseInt(req.query.limit) || 10;
        const shlokas = await Shloka.find()
            .sort({ views: -1 })
            .limit(limit)
            .populate('mantra', 'name');

        res.status(200).json({ success: true, data: shlokas });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.getUserAnalytics = async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        const totalUsers = await User.countDocuments();
        const verifiedUsers = await User.countDocuments({ isVerified: true });
        const blockedUsers = await User.countDocuments({ isBlocked: true });
        const adminUsers = await User.countDocuments({ role: { $in: ['admin', 'super_admin'] } });

        const last7Days = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                verifiedUsers,
                blockedUsers,
                adminUsers,
                last7DaysRegistrations: last7Days,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Add this function to dashboardController.js
exports.getReadAnalytics = async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        // Get total views for mantras and shlokas
        const mantraViews = await Mantra.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: null, total: { $sum: '$views' } } }
        ]);

        const shlokaViews = await Shloka.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: null, total: { $sum: '$views' } } }
        ]);

        // Get views per day for last 7 days
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);

            const dailyMantraViews = await Mantra.countDocuments({
                updatedAt: { $gte: date, $lt: nextDate }
            });

            const dailyShlokaViews = await Shloka.countDocuments({
                updatedAt: { $gte: date, $lt: nextDate }
            });

            last7Days.push({
                date: date.toISOString().split('T')[0],
                mantraViews: dailyMantraViews,
                shlokaViews: dailyShlokaViews,
                total: dailyMantraViews + dailyShlokaViews
            });
        }

        res.status(200).json({
            success: true,
            data: {
                totalMantraViews: mantraViews[0]?.total || 0,
                totalShlokaViews: shlokaViews[0]?.total || 0,
                totalViews: (mantraViews[0]?.total || 0) + (shlokaViews[0]?.total || 0),
                last7DaysAnalytics: last7Days
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};