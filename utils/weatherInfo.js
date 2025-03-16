const axios = require('axios');

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

module.exports = {
  getWeather
}
