const mongoose = require('mongoose');

const homepageSchema = new mongoose.Schema({
    hero: {
        title: {
            type: String,
            default: 'Discover Divine Mantras & Shlokas',
        },
        subtitle: {
            type: String,
            default: 'Experience the power of ancient Vedic chants for peace, prosperity, and spiritual growth',
        },
        backgroundImage: {
            type: String,
            default: null,
        },
        showSearch: {
            type: Boolean,
            default: true,
        },
    },
    dailyMantra: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mantra',
        default: null,
    },
    featuredMantras: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mantra',
    }],
    seo: {
        metaTitle: {
            type: String,
            default: 'Pandit Ji - Divine Mantras & Shlokas',
        },
        metaDescription: {
            type: String,
            default: 'Discover ancient mantras, shlokas, and Vedic chants for peace, prosperity, and spiritual growth',
        },
        metaKeywords: {
            type: String,
            default: 'mantras, shlokas, vedic chants, spiritual, meditation',
        },
        ogImage: {
            type: String,
            default: null,
        },
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Homepage', homepageSchema);