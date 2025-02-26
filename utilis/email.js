const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (email, verificationToken) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Your Email',
    text: `Click the link to verify your email: http://localhost:4000/verify-email?token=${verificationToken}`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = 
{ sendVerificationEmail };