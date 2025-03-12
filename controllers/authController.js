const User = require("../models/userModel");
const {
    generateTokens,
    cookieOptions,
    refreshCookieOptions } = require('../config/jwt');
const ApiError = require('../utils/ApiError');

const getSignup = (req, res) => res.render("index");
const getLogin = (req, res) => res.render("login");

const postSignup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (await User.findOne({ email })) {
            throw new ApiError(400, 'Email already exists');
        }

        const user = await User.create({
            name,
            email,
            password,
            profile_image: req.file?.filename
        });

        const { accessToken, refreshToken } = generateTokens(user);

        // Store refresh token in database
        user.refreshToken = refreshToken;
        await user.save();

        // Set tokens in HTTP-only cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.redirect('/profile');
    } catch (error) {
        next(error);
    }
};

const postLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            throw new ApiError(401, 'Invalid credentials');
        }

        const { accessToken, refreshToken } = generateTokens(user);

        // Update refresh token in database
        user.refreshToken = refreshToken;
        await user.save();
        res.cookie('accessToken', accessToken, cookieOptions);
        res.cookie('refreshToken', refreshToken, refreshCookieOptions);

        res.redirect('/profile');
    } catch (error) {
        a
        next(error);
    }
};

const logout = async (req, res) => {
    // Clear cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    // Remove refresh token from DB
    await User.findByIdAndUpdate(req.user.id, { refreshToken: null });

    res.redirect('/auth/login');
};

const crypto = require('crypto');
const { sendOTPEmail } = require('../utils/email');

// Add these new controller methods
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        // Generate OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

        user.resetPasswordOTP = otp;
        user.resetPasswordExpire = otpExpiry;
        await user.save();

        await sendOTPEmail(user.email, otp);

        res.render('reset-password', {
            message: 'OTP sent to your email',
            email: user.email
        });
    } catch (error) {
        next(error);
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const { email, otp, newPassword } = req.body;
        console.log(
            req.body
        );
        
        const user = await User.findOne({
            email,
            resetPasswordExpire: { $lt: Date.now() }
        });

        if (!user || user.resetPasswordOTP !== otp) {
            throw new ApiError(400, 'Invalid or expired OTP');
        }

        user.password = newPassword;
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        // Clear existing tokens
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        res.redirect('/auth/login');
    } catch (error) {
        next(error);
    }
};

// Update exports
module.exports = {
    getSignup,
    getLogin,
    postSignup,
    postLogin,
    logout,
    forgotPassword,
    resetPassword
};