const express = require("express");
const router = express.Router();
const { getProfile, updateProfile } = require("../controllers/profileController");

router.get("", getProfile);
router.post("", updateProfile);

module.exports = router;