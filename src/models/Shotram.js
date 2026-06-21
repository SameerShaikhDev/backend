const mongoose = require('mongoose');

const shotramSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Shotram name is required'],
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
    // Hindi & English
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
    // Shotram is linked to Category
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

shotramSchema.index({ name: 1 });
shotramSchema.index({ slug: 1 });
shotramSchema.index({ category: 1 });
shotramSchema.index({ order: 1 });

module.exports = mongoose.model('Shotram', shotramSchema);