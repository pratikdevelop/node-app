const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    first_name: {
        required: true,
        type: "string"
    },
    last_name: {
        required: true,
        type: "string"
    },
    email: {
        required: true,
        unique: true,
        type: "string"
    },
    otp: {
        type: String,
        expires: '10m',
        index: true
    },
    date_of_birth: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: "string"
    },
    phone: {
        required: true,
        type: Number
    },
    profile_image: {
        type: String
    },
    status: {
        type: String,
        default: 'offline',
        required: true

    }
})
userSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
        next();
    }

})
const users = new mongoose.model("Users", userSchema)
module.exports = users;