const express =  require('express');
const { getCurrentWeather } = require('../controllers/weatherInfo');

const router = express.Router();
const authenticateUser = require('../middleware/authentication');

router.use(authenticateUser);

router.get('/current/:locationId', getCurrentWeather);


module.exports = router;