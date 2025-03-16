const express =  require('express');
const { 
  getCurrentWeather,
  getDailyWeatherForecast,
 } = require('../controllers/weatherInfo');

const router = express.Router();
const authenticateUser = require('../middleware/authentication');

router.use(authenticateUser);

router.get('/current/:locationId', getCurrentWeather);
router.get('/daily/:locationId', getDailyWeatherForecast);


module.exports = router;