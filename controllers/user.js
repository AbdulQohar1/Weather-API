require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { StatusCodes } = require('http-status-codes');
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

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to signup user. Please try again',
    error: error.message,
    });
  }
}




