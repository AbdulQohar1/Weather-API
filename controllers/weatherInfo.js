const Location = require('../models/location');
const {StatusCodes} = require('http-status-codes');
const { getWeather,
  getDailyForecast,
 } = require('../utils/weatherInfo');

// Get the current weather for a location.
const getCurrentWeather = async (req, res) => {
  const {userId} =  req.user;;
  const {locationId} = req.params;

  try {
    // get user id && locationId
    const location = await Location.findOne({userId, _id: locationId});

    if (!location) {
      return res.status(StatusCodes.NOT_FOUND).json({message: 'Location not found'});
    };

    const { coordinates } = location;
    const [longitude, latitude] = coordinates.coordinates;

    // fetch weather data
    const weatherData = await getWeather(latitude, longitude);

    res.status(StatusCodes.OK).json({         
      currentWeather: weatherData,
      message: 'Weather data fetched successfully'
    });
  } catch (error) {
    console.log('Error fetching current weather data:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      message: 'Failed to fetch weather data', 
      error: error.message 
    });
  }
}

// Get daily forecast for a location.
const getDailyWeatherForecast = async (req, res) => {
  const {userId} = req.user;
  const {locationId} = req.params;

  try {
    // get user id && locationId
    const location = await Location.findOne({userId, _id: locationId});

    if (!location) {
      return res.status(StatusCodes.NOT_FOUND).json({message: 'Location not found'});
    };

    const { coordinates } = location;
    const [longitude, latitude] = coordinates.coordinates;

    // fetch daily forecast data
    const dailyForecast = await getDailyForecast(latitude, longitude);

    res.status(StatusCodes.OK).json({         
      dailyForecast,
      message: 'Daily forecast data fetched successfully'
    });
  } catch (error) {
    console.log('Error fetching daily forecast data:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      message: 'Failed to fetch daily forecast data', 
      error: error.message 
    });
  }
}

// GET /weather/daily: Get the daily forecast for a location.
// GET /weather/hourly: Get the hourly forecast for a location.

module.exports = {
  getCurrentWeather,
  getDailyWeatherForecast,
};

