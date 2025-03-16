const Location = require('../models/location');
const {StatusCodes} = require('http-status-codes');
const { getWeather } = require('../utils/weatherInfo');

const getWeather = async (req, res) => {
  
}



// GET /weather/daily: Get the daily forecast for a location.
// GET /weather/hourly: Get the hourly forecast for a location.

module.exports = {
  getWeather,

};

