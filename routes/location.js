const express = require('express');
const { 
  getLocations, 
  createLocation, 
  updateLocation, 
  deleteLocation 
} = require('../controllers/location');
const route =  express.Router();
const authenticateUser = require('../middleware/authenticate');