const User = require("../models/userModel");
const ApiError = require("../utils/ApiError");
const { verifyToken } = require("../config/jwt");

const getProfile = async (req, res, next) => {
  try {
    // Get token from cookies
    
    console.log(
        "req.cookies",
        req.cookies,
        req.user
    )
    // Get fresh user data from DB
    const user = await User.findById(req.user.id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    res.render("profile", { user });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET);
    
    const { name, email, phone, address } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      { name, email, phone, address },
      { new: true, runValidators: true }
    );

    // Optionally generate new tokens if email changed
    if (updatedUser.email !== decoded.email) {
      const { generateTokens } = require("../config/jwt");
      const { accessToken, refreshToken } = generateTokens(updatedUser);
      
      res.cookie("accessToken", accessToken, cookieOptions);
      res.cookie("refreshToken", refreshToken, refreshCookieOptions);
    }

    res.redirect("/profile");
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile };