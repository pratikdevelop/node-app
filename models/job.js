const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    employer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: { type: String, required: true, maxlength: 255 },
    description: { type: String, required: true, maxlength: 5000 },
    location: { type: String, required: true, maxlength: 255 },
    salary_range: { type: String, maxlength: 100 },
    job_type: {
        type: String,
        enum: ['full_time', 'part_time', 'contract'],
        default: 'full_time',
    },
    posted_at: { type: Date, default: Date.now },
    expires_at: { type: Date },
    is_active: { type: Boolean, default: true },
});

jobSchema.index({ employer: 1, posted_at: -1 }); // Index for sorting by date

module.exports = mongoose.model('Job', jobSchema);