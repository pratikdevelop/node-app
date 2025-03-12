const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.SMTP_SERVICE,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Password Reset OTP',
    html: `<p>Your OTP for password reset is: <strong>${otp}</strong></p>
           <p>This OTP is valid for 10 minutes</p>`
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOTPEmail };