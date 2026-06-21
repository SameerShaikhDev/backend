const Homepage = require('../models/Homepage');

const getHomepageDoc = async () => {
    let homepage = await Homepage.findOne();
    if (!homepage) {
        homepage = await Homepage.create({
            updatedBy: '60d5f9f8b8e5a72d4c8e4567',
        });
    }
    return homepage;
};

exports.getHero = async (req, res) => {
    try {
        const homepage = await getHomepageDoc();
        res.status(200).json({ success: true, data: homepage.hero });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.updateHero = async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        const { title, subtitle, backgroundImage, showSearch } = req.body;
        const homepage = await getHomepageDoc();

        homepage.hero = { title, subtitle, backgroundImage, showSearch };
        homepage.updatedBy = req.user.id;
        await homepage.save();

        res.status(200).json({ success: true, message: 'Hero section updated', data: homepage.hero });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.getDailyMantra = async (req, res) => {
    try {
        const homepage = await getHomepageDoc();
        if (homepage.dailyMantra) {
            await homepage.populate('dailyMantra');
        }
        res.status(200).json({ success: true, data: homepage.dailyMantra });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.updateDailyMantra = async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        const { mantraId } = req.body;
        const homepage = await getHomepageDoc();

        homepage.dailyMantra = mantraId;
        homepage.updatedBy = req.user.id;
        await homepage.save();

        res.status(200).json({ success: true, message: 'Daily mantra updated', data: { dailyMantra: mantraId } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.getFeaturedMantras = async (req, res) => {
    try {
        const homepage = await getHomepageDoc();
        await homepage.populate('featuredMantras');
        res.status(200).json({ success: true, data: homepage.featuredMantras });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.updateFeaturedMantras = async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        const { mantraIds } = req.body;
        const homepage = await getHomepageDoc();

        homepage.featuredMantras = mantraIds;
        homepage.updatedBy = req.user.id;
        await homepage.save();

        res.status(200).json({ success: true, message: 'Featured mantras updated', data: { featuredMantras: mantraIds } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.getSEO = async (req, res) => {
    try {
        const homepage = await getHomepageDoc();
        res.status(200).json({ success: true, data: homepage.seo });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.updateSEO = async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        const { metaTitle, metaDescription, metaKeywords, ogImage } = req.body;
        const homepage = await getHomepageDoc();

        homepage.seo = { metaTitle, metaDescription, metaKeywords, ogImage };
        homepage.updatedBy = req.user.id;
        await homepage.save();

        res.status(200).json({ success: true, message: 'SEO updated', data: homepage.seo });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};