const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: { type: String, required: true, maxlength: 255 },
    company: { type: String, required: true, maxlength: 255 },
    location: { type: String, maxlength: 255 },
    start_date: { type: Date, required: true },
    end_date: { type: Date },
    description: { type: String, maxlength: 2000 },
    is_current: { type: Boolean, default: false },
});

experienceSchema.index({ user: 1, start_date: -1 }); // Sort by start_date descending

module.exports = mongoose.model('Experience', experienceSchema);