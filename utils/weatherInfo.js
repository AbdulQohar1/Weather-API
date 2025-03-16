const axios = require('axios');

// get weather data
const getWeather = async (latitude, longitude) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log("getWeather data failed: ", error);
    throw new Error('Failed to get weather data');
  }
}

// fetch daily forecast for a location.
const getDailyForecast = async (latitude, longitude) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  // const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log("getDailyForecast data failed: ", error);
    throw new Error('Failed to fetch daily forecast data');
  }
}


module.exports = {
  getWeather,
  getDailyForecast,
}
