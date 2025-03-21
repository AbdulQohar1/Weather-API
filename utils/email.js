const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

const sendVerificationEmail = async (email, verificationToken) => {
  const mailOptions = {
    from: '"Weather App" <no-reply@weatherapp.com>', 
    to: email,
    subject: 'Verify Your Email', 
    text: `Click the link to verify your email: http://localhost:4000/api/v1/auth/verify-email?token=${verificationToken}`, 
    html: `<p>Click the link to verify your email: <a href="http://localhost:4000/api/v1/auth/verify-email?verificationToken=${verificationToken}">Verify Email</a></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    error.message = 'Failed to send verification email';
    throw new Error(error);
  }
};

module.exports = 
{ sendVerificationEmail };