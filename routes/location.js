const express = require('express');
const { 
  setLocation,
  getUserLocations,
  deleteLocation,
} = require('../controllers/location');
const router =  express.Router();
const authenticateUser = require('../middleware/authentication');

router.use(authenticateUser);

router.post('/set-location', setLocation);
router.get('/', getUserLocations);
router.delete('/:locationId', deleteLocation);

module.exports = router;
