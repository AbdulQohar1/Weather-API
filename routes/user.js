const express = require('express');
const { 
  userProfile, 
  updateUserProfile 
} = require('../controllers/user');

const router = express.Router();  

router.get('/profile', userProfile);
router.put('/profile', updateUserProfile);

module.exports = router;