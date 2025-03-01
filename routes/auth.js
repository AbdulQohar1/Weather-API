const express = require('express');
const { 
  signUp, 
  login,
  verifyEmail, 
} = require('../controllers/auth');

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
// router.get('/verify-email', verifyEmail);

module.exports = router;
