
const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const { getSignup, getLogin, postSignup, postLogin, logout,  forgotPassword,
    resetPassword } = require("../controllers/authController");
const authMiddleware = require("../middlewares/auth");
router.get("/", getSignup);
router.get("/login", getLogin);
router.post("/signup", upload.single("profilePic"), postSignup);
router.post("/login", postLogin);
router.get(
    "/logout",
    authMiddleware,
    logout

)
router.get('/forgot-password', (req, res) => res.render('forget-password'));
router.post('/forgot-password', forgotPassword);
router.get('/reset-password', (req, res) => res.render('reset-password'));
router.post('/reset-password', resetPassword);

module.exports = router;

  
