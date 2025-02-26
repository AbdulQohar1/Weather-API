require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
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
    const verificationToken = user.createVerificationToken();
    user.verificationToken = verificationToken;
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

const login = async (req, res) => {
  const { email, password } = req.body;
  // check if all fields are provided
  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Please provide email and password'});
  };

  try{ 
    // find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Invalid credentials'});
    };

    // verify password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid credentials'});
    };

    const token = user.createVerificationToken();
    
    res.status(StatusCodes.OK).json({ 
      id: user._id,
      user: {email: user.email},
      token,  
      message: 'User logged in successfully'
    });

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to login user. Please try again',
    error: error.message,
    });
  }
};

// const verifyEmail = async (req, res) => {
//   const { email, verificationToken } = req.body;
//   // check if all fields are provided 
//   if (!email || !verificationToken) {
//     return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Please provide email and verification token'});
//   };

// }

module.exports = {
  signUp,
  login
};



