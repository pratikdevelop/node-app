require("../models/conn.js");
const users = require("../models/users");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const client = require("twilio")(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
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
          phone,
          confirm_password,
          date_of_birth,
        } = req.body.body;
        const newUser = new users({
          first_name,
          last_name,
          email,
          password,
          phone,
          confirm_password,
          date_of_birth,
        });
        const data = await newUser.save();
        res.set("Access-Control-Allow-Origin", "*");
        res.sendStatus(200).send("data Inserted Successfully");
      } catch (error) {
        console.log(error);
        res.sendStatus(500).json({ status: "error occured", error: error });
      }
    },
    async getUsers(req, res) {
      try {
        const data = await users.find();
        res.sendStatus(200).json({ users: data });
      } catch (error) {
        res.sendStatus(500).json({ error: error });
      }
    },
    async login(req, res) {
      console.log(req.body)
      // res.sendStatus(200).json({
      //   message: "login successfully",
      //   data: { token: token, userId: '63ac89ee70be1caeaeb472ee'},
      //   status: 200,
      // })
      const { email, password } = req.body.body;
      try {
        const user = await users.findOne({ email: email });
        if (!user) return;
        const isUser = await bcryptjs.compare(password, user.password);
        if (isUser) {
          const token = jwt.sign({ id: this._id }, process.env.SECRET_KEY);
          return res.sendStatus(200).json({
            message: "login successfully",
            data: { token: token, userId: user.id },
            status: 200,
          });
        } else {
          // newUser@12345
          return res.sendStatus(401).json({ message: "credentials Bad" });
        }
      } catch (error) {
        console.log(error);
        return res.sendStatus(500).json({ error: error });
      }
    },

    async forgetPassword(req, res) {
      console.log("email", req.body.email);
      const email = req.body.email;
      try {
        const user = await users.findOne({ email: email });
        if (user) {
          const otp = otpGenerator.generate(14, {
            upperCaseAlphabets: true,
            specialChars: true,
            digits: true,
            lowerCaseAlphabets: true
          });
          const mailOptions = {
            from: process.env.EMAIL_SEND,
            to: email,
            subject: 'send reset password otp',
            html:
              `<p>Hi ${user.first_name} ${user.last_name} use this  otp  ${otp}help you to reset your password </p>`,
          };

          await users.findOneAndUpdate(
            {
              email: email,
            },
            { $set: { otp } },
            { new: true }
          );
          transporter.sendMail(mailOptions, function (error, info) {
            console.log('Error', error)
            if (error) {
              return res.sendStatus(500).json({
                message:
                  "internal server error for send otp, please try again letter",
                status: 500,
                success: false,
              });
              /*client.messages
                .create({
                  body: `Hi ${
                    (user.first_name, user.last_name)
                  } this  is your otp ${otp}`,
                  from: "+18881388112",
                  to: "+18932594517",
                })
                .then((message) => {
                  return res.sendStatus(200).json({
                    message:
                      "otp send your number please check you message box",
                    status: 200,
                    success: true,
                  });
                })
                .catch((err) => {
                  return res.sendStatus(500).json({
                    message:
                      "internal server error for send otp, please try again letter",
                    status: 500,
                    success: false,
                  });
                });*/
            } else {
              res.sendStatus(200).json({
                message: info.messageId,
                isSendOtp: true,
                success: true,
              });
            }
          });
        } else {
          res.sendStatus(401).json({
            message: "Email is not find, Please Enter Correct Email",
            status: 401,
            success: false,
          });
        }
      } catch (error) {
        console.log(error);
        res
          .sendStatus(500)
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
        console.log(email,otp);
        const user = await users.findOne({ email, otp });
        if (!user) {
          res .sendStatus(401).json({ error: "Link is Expired" });
        } else {
          const token = jwt.sign({ _id: user._id }, "SECRET_TOKEN");
          res
            .sendStatus(200)
            .json({ message: "otp verification success", userId: user._id });
        }
      } catch (err) {
        res.sendStatus(500).json({ error: err.message });
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
          res.sendStatus(200).json({ data: data });
        } catch (error) {
          res.sendStatus(500).json({ error: error.message() });
        }
      }
    },
    async changePassword(req, res) {
      console.log("demo45");
      try {
        const { password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
          res
            .sendStatus(400)
            .json({ mesage: "password and confoirm password not match" });
          return;
        }
        console.log(password);
        const newPassword = await bcryptjs.hash(password, 10);
        console.log(newPassword);

        const data = await users.findByIdAndUpdate(
          { _id: req.params.id },
          {
            $set: { newPassword },
          }
        );
        res
          .sendStatus(200)
          .json({ data: data, message: "password changed successfully" });
      } catch (err) {
        res.sendStatus(500).json({ msg: err });
      }
    },
  };
};
module.exports = userController;
