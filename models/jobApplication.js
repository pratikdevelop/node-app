const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
    },
    job_seeker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    applied_at: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
    },
    cover_letter: { type: String, maxlength: 2000 },
});

jobApplicationSchema.index({ job: 1, job_seeker: 1 }, { unique: true }); // Prevent duplicate applications

module.exports = mongoose.model('JobApplication', jobApplicationSchema);