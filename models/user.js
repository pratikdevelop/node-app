const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email'],
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false, // Prevents password from being returned in queries by default
    },
    profile_image: { type: String }, // File path or URL
    phone: {
        type: String,
        match: [/^[0-9+()-]*$/, 'Invalid phone number'],
    },
    username: { type: String, unique: true, sparse: true }, // Sparse allows nulls while enforcing uniqueness
    status: {
        type: String,
        enum: ['online', 'offline'],
        default: 'offline',
    },
    role: {
        type: String,
        enum: ['job_seeker', 'employer', 'admin'],
        default: 'job_seeker',
    },
    description: { type: String, maxlength: 2000 },
    date_of_birth: { type: Date },
    location: { type: String, maxlength: 255 },
    gender: {
        type: String,
        enum: ['M', 'F', 'O', 'P'],
        default: 'P',
    },
    resume: { type: String }, // File path or URL
    linkedin_url: {
        type: String,
        match: [/^https?:\/\/[^\s$.?#].[^\s]*$/, 'Invalid URL'],
    },
    company_name: { type: String, maxlength: 255 },
    company_website: {
        type: String,
        match: [/^https?:\/\/[^\s$.?#].[^\s]*$/, 'Invalid URL'],
    },
    company_description: { type: String, maxlength: 2000 },
    last_login_ip: { type: String },
    email_verified: { type: Boolean, default: false },
    onboarding_complete: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true },
    is_admin: { type: Boolean, default: false },
    refreshToken: { type: String },
    resetPasswordOTP: { type: String },
    resetPasswordExpire: { type: Date },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

// Pre-save hook to hash password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);