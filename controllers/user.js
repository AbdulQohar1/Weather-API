require('dotenv').config();
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const User = require('../models/user');
const { CommandSucceededEvent } = require('mongodb');

// GET /profile: Get user profile details.
const userProfile = async (req, res) => {
  try {
   const user = await User.findById(req.user.userId).select('-password');

   if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
   };
    res.status(StatusCodes.OK).json({ user });
  
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to get user profile', error: error.message });
  }
};

// PUT /profile: Update user profile.
const updateUserProfile = async (req, res) => {
  try {
    // extract user credentials from headers
    const { email, authorization } = req.headers;
    const token = authorization.split(' ')[1];

    // validate headers
    if (!email || !token) {
      return res.status(StatusCodes.BAD_REQUEST).json({ 
        success: false,
        message: 'Please provide email and token in headers' 
      });
    }

    // verify the provided token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ 
        success: false,
        message: 'Invalid token' 
      });
    };

    // check if email matches token
    if (email != decoded.email) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid credentials; email and token mismatch'
      });
    };

    // find user by email in db
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'User not found'
      });
    };

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to update user profile', error: error.message });
  }

}  

module.exports = { 
  userProfile,
  updateUserProfile,
};