const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    degree: { type: String, required: true, maxlength: 255 },
    institution: { type: String, required: true, maxlength: 255 },
    location: { type: String, maxlength: 255 },
    start_date: { type: Date, required: true },
    end_date: { type: Date },
    description: { type: String, maxlength: 2000 },
    is_current: { type: Boolean, default: false },
});

educationSchema.index({ user: 1, start_date: -1 }); // Sort by start_date descending

module.exports = mongoose.model('Education', educationSchema);