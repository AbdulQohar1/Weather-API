require('dotenv').config();
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { sendVerificationEmail } = require('../utils/email');
const User = require('../models/user');

// sign up user
const signUp = async (req, res) => {
  const { username, email, password } = req.body;

  // check if all feilds are provided
  if (!username || !email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Please provide all fields'});
  };

  try{
    // check if user already exists
    const existingUser = await User.findOne({ email});
    if (existingUser) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'User already exists'});
    };

    // create a new user
    const user = await User.create({ username, email, password });

    // create && save verification token
    const verificationToken = user.createVerificationToken();
    await user.save();

    // send verification email
    await sendVerificationEmail(email, verificationToken);

    res.status(StatusCodes.CREATED).json({ 
      id: user._id,
      username: user.username,
      message: 'User created successfully. Please check your email to verify your account.'});

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to signup user. Please try again',
    error: error.message,
    });
  }
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.query;

  if (!verificationToken) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'Verification token not found'});
  };

  try {
    // find user using verification token
    const user = await User.findOne({ verificationToken });

    // check if user exists
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Invalid verification token'});
    };

    // update user status to verified
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(StatusCodes.OK).json({ 
      message: 'Email verified successfully.'
    });

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to verify email. Please try again',
    error: error.message,
    });
  }
}

const login = async (req, res) => {
  const { email, password } = req.body;

  // Check if all fields are provided
  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Please provide email and password' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found! Please sign up.' });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Please verify your email before logging in.' });
    }

    // Verify password
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = user.createAuthToken();

    res.status(StatusCodes.OK).json({
      id: user._id,
      user: { email: user.email },
      token,
      message: 'User logged in successfully'
    });

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to login user. Please try again',
      error: error.message,
    });
  }
};

module.exports = {
  signUp,
  login,
  verifyEmail,

};



