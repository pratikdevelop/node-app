const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    street: { type: String, maxlength: 255 },
    city: { type: String, maxlength: 100 },
    state: { type: String, maxlength: 100 },
    zip_code: { type: String, maxlength: 20 },
    country: { type: String, maxlength: 100 },
    address_type: {
        type: String,
        enum: ['home', 'work', 'other'],
        default: 'home',
    },
    is_primary: { type: Boolean, default: false },
});

addressSchema.index({ user: 1, street: 1, city: 1 }, { unique: true }); // Unique address per user

module.exports = mongoose.model('Address', addressSchema);