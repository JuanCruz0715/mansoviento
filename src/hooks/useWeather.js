import { useState, useEffect } from 'react';

const LAT = -31.5375;
const LON = -68.5364;
const API_KEY = 'a4bc9566579c0764802ec6e156db2b2a';

// Función auxiliar para procesar datos horarios
const processHourlyData = (data) => {
  const days = [];
  for (let day = 0; day < 7; day++) {
    const dayStart = day * 24;
    const dayData = {
      date: data.hourly.time[dayStart].split('T')[0],
      hours: []
    };
    
    for (let hour = dayStart; hour < dayStart + 24; hour++) {
      dayData.hours.push({
        time: data.hourly.time[hour],
        hour: new Date(data.hourly.time[hour]).getHours(),
        temperature: Math.round(data.hourly.temperature_2m[hour]),
        windSpeed: Math.round(data.hourly.wind_speed_10m[hour]),
        windGusts: Math.round(data.hourly.wind_gusts_10m[hour]),
        windDirection: data.hourly.wind_direction_10m[hour],
        windInfo: getWindDirection(data.hourly.wind_direction_10m[hour]),
        precipitation: data.hourly.precipitation[hour],
        precipitationProbability: data.hourly.precipitation_probability[hour],
        isDangerous: data.hourly.wind_gusts_10m[hour] > 70
      });
    }
    days.push(dayData);
  }
  return days;
};

// Hook principal
export const useWeather = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAllWeatherData = async () => {
    try {
      const [currentResponse, forecastResponse] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric&lang=es`),
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&hourly=temperature_2m,wind_speed_10m,wind_gusts_10m,wind_direction_10m,precipitation,precipitation_probability,weather_code&timezone=America/Argentina/San_Juan&forecast_days=7`)
      ]);

      const [currentData, forecastData] = await Promise.all([
        currentResponse.json(),
        forecastResponse.json()
      ]);

      setCurrentWeather(currentData);
      setHourlyForecast(processHourlyData(forecastData));
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllWeatherData();
  }, []);

  return { currentWeather, hourlyForecast, loading, refetch: fetchAllWeatherData };
};

// Exportar getWindDirection como función independiente
export const getWindDirection = (degrees) => {
  if (degrees >= 337.5 || degrees < 22.5) return { direction: 'N', arrow: '⬆️' };
  if (degrees >= 22.5 && degrees < 67.5) return { direction: 'NE', arrow: '↗️' };
  if (degrees >= 67.5 && degrees < 112.5) return { direction: 'E', arrow: '➡️' };
  if (degrees >= 112.5 && degrees < 157.5) return { direction: 'SE', arrow: '↘️' };
  if (degrees >= 157.5 && degrees < 202.5) return { direction: 'S', arrow: '⬇️' };
  if (degrees >= 202.5 && degrees < 247.5) return { direction: 'SW', arrow: '↙️' };
  if (degrees >= 247.5 && degrees < 292.5) return { direction: 'W', arrow: '⬅️' };
  if (degrees >= 292.5 && degrees < 337.5) return { direction: 'NW', arrow: '↖️' };
  return { direction: '-', arrow: '' };
};