const Location = require('../models/location');
const {StatusCodes} = require('http-status-codes');
const { getWeather,
   getForecast,
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
    const dailyForecast = await getForecast(latitude, longitude);

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

// Get the hourly forecast for a location.
const getHourlyWeatherForecast = async (req, res) => {
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

    // fetch hourly forecast data
    const hourlyForecast = await getForecast(latitude, longitude);

    res.status(StatusCodes.OK).json({         
      hourlyForecast,
      message: 'Hourly forecast data fetched successfully'
    });
  } catch (error) {
    console.log('Error fetching hourly forecast data:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      message: 'Failed to fetch hourly forecast data', 
      error: error.message 
    });
  }
}

// Weather Alerts
//retrieve active weather alerts.
const getActiveWeatherAlerts = async (req, res) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/alerts?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;


  try { 
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log("active weather alerts failed: ", error);
    throw new Error('Failed to get active weather alerts');
  }
}

//POST /alerts/custom: Set custom weather alerts.


module.exports = {
  getCurrentWeather,
  getDailyWeatherForecast,
  getHourlyWeatherForecast,
};

