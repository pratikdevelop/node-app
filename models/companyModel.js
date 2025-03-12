const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 255 },
    website: {
        type: String,
        match: [/^https?:\/\/[^\s$.?#].[^\s]*$/, 'Invalid URL'],
    },
    description: { type: String, maxlength: 2000 },
    logo: { type: String }, // File path or URL
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

companySchema.index({ created_by: 1 }); // Index for faster queries by user

module.exports = mongoose.model('Company', companySchema);