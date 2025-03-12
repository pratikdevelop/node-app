const jwt = require('jsonwebtoken');

const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_ACCESS_SECRET || "thisisaecretkey",
        { expiresIn: '15m' }
    );
    
    const refreshToken = jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET || "thisisaecretkey",
        { expiresIn: '7d' }
    );
    
    return { accessToken, refreshToken };
};

const verifyToken = (token, secret) => {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
};
const cookieOptions = {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: process.env.SAME_SITE,
    maxAge: 15 * 60 * 1000
  };
  
  const refreshCookieOptions = {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000
  };

module.exports = { generateTokens, verifyToken, cookieOptions, refreshCookieOptions };