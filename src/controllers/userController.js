require("../models/conn.js");
const users = require("../models/users");
const expires = require("../models/otp");
const validator = require("express-validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "developertest1234568@gmail.com",
    pass: "hnsoawogckrwauua"
  },
});



const userController = () => {
  return {
    index(req, res) {
      res.send("home");
    },
    async signup(req, res) {
      try {
        const {
          first_name,
          last_name,
          email,
          password,
          username,
          phone,
          confirm_password,
          date_of_birth,
        } = req.body;
        const newUser = new users({
          first_name,
          last_name,
          email,
          username,
          password,
          phone,
          confirm_password,
          date_of_birth,
        });
        const data = await newUser.save();
        return res.status(200).send(" user registeration success");
      } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "error occured", error: error });
      }
    },
    async getUsers(req, res) {
      try {
        const data = await users.find();
        res.status(200).json({ users: data });
      } catch (error) {
        res.status(500).json({ error: error });
      }
    },
    async login(req, res) {
      const { email, password } = req.body;
      try {
        const user = await users.findOne({ email });
        if (!user) {
          return res.status(401).json({ message: "user email does not exists, please enter correct email" });
        }
        const isUser = await bcryptjs.compare(password, user.password);
        if (isUser) {
          const token = jwt.sign({ id: this._id }, process.env.SECRET_KEY);
          return res.status(200).json({
            message: "login successfully",
            data: { token: token, userId: user.id },
            status: 200,
          });
        } else {
          return res.status(401).json({ message: "user password does not found, please try again" });
        }
      } catch (error) {
        return res.status(500).json({ error: error });
      }
    },

    async forgetPassword(req, res) {
      const email = req.body.email;
      try {
        const user = await users.findOne({ email: email });
        if (user) {
          const otp = otpGenerator.generate(50, {
            upperCaseAlphabets: true,
            specialChars: true,
            digits: true,
            lowerCaseAlphabets: true
          });

          const mailOptions = {
            from: process.env.EMAIL_SEND,
            to: email,
            subject: 'Password Reset Request',
            html:
              `<h1> Hello ${user.first_name} ${user.last_name}, </h1>
              <p> we will recieve request of reset password from your site  ,
                <br/>We will  send this one Time password for reset the password 
                that is your otp  ${otp} , this can valid for 10 mins <br/>
                If you didn't requset this, you can safely ignore this email  
              </p>`
          };

          const expire = new expires({ otp });
          const response = await expire.save();
          transporter.sendMail(mailOptions, function (error, info) {
            console.log('Error', error)
            if (error) {
              return res.status(500).json({
                message:
                  "internal server error for send otp, please try again letter",
                status: 500,
                success: false,
              })
            } else {
              return res.status(200).json({
                message: info.messageId,
                isSendOtp: true,
                success: true,
              });
            }
          });

        } else {
          return res.status(401).json({
            message: "Email is not find, Please Enter Correct Email",
            status: 401,
            success: false,
          });
        }
      } catch (error) {
        console.error(error)
        return res
          .status(500)
          .json({
            message: "Internal Server Error",
            status: 500,
            success: false,
          });
      }
    },


    async verifyOtp(req, res, next) {
      try {
        const { email, otp } = req.body;
        console.log(email, otp);
        const user = await users.findOne({ email, otp });
        if (!user) {
          return res.status(401).json({ error: "Link is Expired" });
        } else {
          const token = jwt.sign({ _id: user._id }, "SECRET_TOKEN");
          return res
            .status(200)
            .json({ message: "otp verification success", userId: user._id });
        }
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    },
    async getUserById(req, res) {
      try {
        const userId = req.params.id;
        const user = await users.findById(userId);
        res.send(user);
      } catch (error) {
        res.send(error);
      }
    },

    async updateProfile(req, res) {
      if (req.file) {
        try {
          const data = await users.findByIdAndUpdate(
            { _id: req.params.id },
            {
              $set: {
                profile_image: req.file.path,
              },
            }
          );
          res.status(200).json({ data: data });
        } catch (error) {
          res.status(500).json({ error: error.message() });
        }
      }
    },
    async changePassword(req, res) {
      console.log("demo45");
      try {
        const { password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
          res
            .status(400)
            .json({ mesage: "password and confirm password not match" });
          return;
        }
        // console.log(password);
        const newPassword = await bcryptjs.hash(password, 10);
        // console.log(newPassword);

        const data = await users.findByIdAndUpdate(
          { _id: req.params.id },
          {
            $set: { newPassword },
          }
        );
        res
          .status(200)
          .json({ data: data, message: "password changed successfully" });
      } catch (err) {
        console.log(err)
        res.status(500).json({ msg: err });
      }
    },
  };
};
module.exports = userController;
