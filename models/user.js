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
  isVerified: {
    type: Boolean,
    // new users are not verified by default
    default: false, 
  },
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
      userId: this._id, 
      email: this.email
    }, 
    process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
  this.verificationToken = verificationToken;
  return verificationToken;
};

// compare password
UserSchema.methods.comparePassword = async function(password){
  return await bcrypt.compare(password, this.password);
};


module.exports = mongoose.model('User', UserSchema);