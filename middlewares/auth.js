const { verifyToken } = require('../config/jwt');
const ApiError = require('../utils/ApiError');

const authMiddleware = (req, res, next) => {
    const token = req.cookies?.accessToken || 
                 req.headers?.authorization?.split(' ')[1];
    
    // if (!token) throw new ApiError(401, 'Unauthorized');

    const decoded = verifyToken(token, 'thisisaecretkey');
    // If not token reditrect to /auth/login
    console.log(

    );
    

    if (!decoded) {
     
    return res.redirect('/auth/login');

    }

    req.user = decoded;
    next();
};

module.exports = authMiddleware;