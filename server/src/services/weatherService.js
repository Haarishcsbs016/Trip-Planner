const axios = require('axios');
const logger = require('../utils/logger');

const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Get weather forecast for a destination for the given dates
 */
const getWeatherForecast = async (destination, startDate, days) => {
  if (!WEATHER_API_KEY) {
    logger.warn('OpenWeather API key not configured. Using simulated weather data.');
    return generateSimulatedWeather(days);
  }

  try {
    // First geocode the destination
    const geoRes = await axios.get(`http://api.openweathermap.org/geo/1.0/direct`, {
      params: { q: destination, limit: 1, appid: WEATHER_API_KEY },
    });

    if (!geoRes.data || geoRes.data.length === 0) {
      logger.warn(`Could not geocode ${destination}, using simulated weather`);
      return generateSimulatedWeather(days);
    }

    const { lat, lon } = geoRes.data[0];

    const forecastRes = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: WEATHER_API_KEY,
        units: 'metric',
        cnt: Math.min(days * 8, 40),
      },
    });

    return processWeatherData(forecastRes.data, days, startDate);
  } catch (error) {
    logger.error('Weather API error:', error.message);
    return generateSimulatedWeather(days);
  }
};

const processWeatherData = (data, days, startDate) => {
  const weatherByDay = [];
  const start = new Date(startDate);

  for (let i = 0; i < days; i++) {
    const dayDate = new Date(start);
    dayDate.setDate(start.getDate() + i);
    const dateStr = dayDate.toISOString().split('T')[0];

    // Get forecast entries for this day
    const dayForecasts = data.list.filter((entry) => {
      return entry.dt_txt && entry.dt_txt.startsWith(dateStr);
    });

    if (dayForecasts.length > 0) {
      const avg = dayForecasts[Math.floor(dayForecasts.length / 2)];
      weatherByDay.push({
        day: i + 1,
        date: dateStr,
        condition: avg.weather[0].main,
        description: avg.weather[0].description,
        temperature: Math.round(avg.main.temp),
        humidity: avg.main.humidity,
        rainProbability: Math.round((avg.pop || 0) * 100),
        windSpeed: avg.wind.speed,
        icon: avg.weather[0].icon,
        isOutdoorFriendly: !['Rain', 'Thunderstorm', 'Snow'].includes(avg.weather[0].main),
      });
    } else {
      weatherByDay.push(generateSimulatedWeather(1)[0]);
    }
  }

  return weatherByDay;
};

const generateSimulatedWeather = (days) => {
  const conditions = [
    { condition: 'Clear', description: 'clear sky', temperature: 28, humidity: 60, isOutdoorFriendly: true },
    { condition: 'Clouds', description: 'partly cloudy', temperature: 25, humidity: 65, isOutdoorFriendly: true },
    { condition: 'Clouds', description: 'overcast clouds', temperature: 22, humidity: 70, isOutdoorFriendly: true },
    { condition: 'Rain', description: 'light rain', temperature: 20, humidity: 80, isOutdoorFriendly: false },
  ];

  return Array.from({ length: days }, (_, i) => ({
    day: i + 1,
    condition: conditions[i % conditions.length].condition,
    description: conditions[i % conditions.length].description,
    temperature: conditions[i % conditions.length].temperature,
    humidity: conditions[i % conditions.length].humidity,
    rainProbability: conditions[i % conditions.length].condition === 'Rain' ? 70 : 10,
    windSpeed: 15,
    isOutdoorFriendly: conditions[i % conditions.length].isOutdoorFriendly,
    simulated: true,
  }));
};

module.exports = { getWeatherForecast };
