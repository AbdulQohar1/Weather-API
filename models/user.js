const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt =  require('jsonwebtoken');

// create user schema
// username, email, and password 
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true,'Please provide your name'],
    minLength: 3,
    maxLength: 20,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'please provide your password.'],
    minLength: 8,
    maxLength: 200,
  },
  // confirmPassword: {
  //   type: String,
  //   required: [true, 'Please connfirm your password.'],
  //   minLength: 8,
  //   maxLength: 200,
  // },
}, 
{
  timestamps: true,
});

// hash password before saving
UserSchema.pre('save', async function(){
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// create user verification token
UserSchema.methods.createVerificationToken = function(){
  const verificationToken = jwt.sign({ 
      userId: this._id 
    }, 
    process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
  return verificationToken;
};
module.exports = mongoose.model('User', UserSchema);