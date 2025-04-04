const express =  require('express');
const { 
  getCurrentWeather,
  getDailyWeatherForecast,
  getHourlyWeatherForecast,
  getWeatherAlerts
 } = require('../controllers/weatherInfo');

const router = express.Router();
const authenticateUser = require('../middleware/authentication');

router.use(authenticateUser);

router.get('/current/:locationId', getCurrentWeather);
router.get('/daily/:locationId', getDailyWeatherForecast);
router.get('/hourly/:locationId', getHourlyWeatherForecast);
router.get('/alerts/:locationId', getWeatherAlerts);



module.exports = router;