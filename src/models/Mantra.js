const mongoose = require('mongoose');

const mantraSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Mantra name is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Name must be at least 3 characters'],
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    // Main text in Sanskrit
    sanskrit: {
        type: String,
        required: [true, 'Sanskrit text is required'],
    },
    // 3 language translations
    kannada: {
        type: String,
        required: [true, 'Kannada translation is required'],
    },
    marathi: {
        type: String,
        required: [true, 'Marathi translation is required'],
    },
    tamil: {
        type: String,
        required: [true, 'Tamil translation is required'],
    },
    // Info fields
    benefits: {
        type: String,
        required: [true, 'Benefits are required'],
    },
    howToChant: {
        type: String,
        required: [true, 'How to chant is required'],
    },
    bestTime: {
        type: String,
        required: [true, 'Best time is required'],
    },
    recommendedCount: {
        type: Number,
        default: 108,
    },
    meaning: {
        type: String,
        default: '',
    },
    audioUrl: {
        type: String,
        default: null,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required'],
    },
    image: {
        type: String,
        default: null,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    views: {
        type: Number,
        default: 0,
    },
    order: {
        type: Number,
        default: 0,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});

mantraSchema.index({ name: 1 });
mantraSchema.index({ slug: 1 });
mantraSchema.index({ category: 1 });
mantraSchema.index({ isFeatured: 1 });
mantraSchema.index({ views: -1 });

module.exports = mongoose.model('Mantra', mantraSchema);