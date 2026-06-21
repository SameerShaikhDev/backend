const mongoose = require('mongoose');

const shlokaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Shloka name is required'],
        trim: true,
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
    // English & Hindi for general use
    hindi: {
        type: String,
        default: '',
    },
    english: {
        type: String,
        default: '',
    },
    meaning: {
        type: String,
        default: '',
    },
    audioUrl: {
        type: String,
        default: null,
    },
    // Shloka is linked to Category (NOT to Mantra)
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required'],
    },
    order: {
        type: Number,
        default: 0,
    },
    views: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});

shlokaSchema.index({ name: 1 });
shlokaSchema.index({ slug: 1 });
shlokaSchema.index({ category: 1 });
shlokaSchema.index({ order: 1 });

module.exports = mongoose.model('Shloka', shlokaSchema);