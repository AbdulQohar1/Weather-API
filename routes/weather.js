const express =  require('express');
const { 
  getCurrentWeather,
  getDailyWeatherForecast,
  getHourlyWeatherForecast,
 } = require('../controllers/weatherInfo');

const router = express.Router();
const authenticateUser = require('../middleware/authentication');

router.use(authenticateUser);

router.get('/current/:locationId', getCurrentWeather);
router.get('/daily/:locationId', getDailyWeatherForecast);
router.get('/hourly/:locationId', getHourlyWeatherForecast);


module.exports = router;