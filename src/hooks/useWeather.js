import { useState, useEffect } from 'react';

const LAT = -31.5375;
const LON = -68.5364;
const API_KEY = 'a4bc9566579c0764802ec6e156db2b2a';

// Función auxiliar para procesar datos horarios - CORREGIDA
// VERSIÓN DE EMERGENCIA - Fuerza empezar desde el primer dato
const processHourlyData = (data) => {
  const days = [];
  
  const now = new Date();
  const today = now.toDateString();
  
  console.log('🔄 VERSIÓN EMERGENCIA - HOY:', today);

  // SIMPLEMENTE tomar los primeros 6 días disponibles
  for (let day = 0; day < 7; day++) {
    const dayStartIndex = day * 24;
    if (dayStartIndex >= data.hourly.time.length) break;

    const firstHourDate = new Date(data.hourly.time[dayStartIndex]);
    
    let dayLabel;
    if (day === 0) dayLabel = 'HOY';
    else if (day === 1) dayLabel = 'MAÑ';
    else if (day === 2) dayLabel = 'PAS';
    else {
      dayLabel = firstHourDate.toLocaleDateString('es-AR', { weekday: 'short' });
    }

    const dayData = {
      date: data.hourly.time[dayStartIndex].split('T')[0],
      dayLabel: dayLabel,
      hours: []
    };
    
    for (let hour = 0; hour < 24; hour++) {
      const hourIndex = dayStartIndex + hour;
      if (hourIndex >= data.hourly.time.length) break;
      
      const hourDate = new Date(data.hourly.time[hourIndex]);
      
      dayData.hours.push({
        time: data.hourly.time[hourIndex],
        hour: hourDate.getHours(),
        temperature: Math.round(data.hourly.temperature_2m[hourIndex]),
        windSpeed: Math.round(data.hourly.wind_speed_10m[hourIndex]),
        windGusts: Math.round(data.hourly.wind_gusts_10m[hourIndex]),
        windDirection: data.hourly.wind_direction_10m[hourIndex],
        windInfo: getWindDirection(data.hourly.wind_direction_10m[hourIndex]),
        precipitation: data.hourly.precipitation[hourIndex],
        precipitationProbability: data.hourly.precipitation_probability[hourIndex],
        isDangerous: data.hourly.wind_gusts_10m[hourIndex] > 70
      });
      
     
    }
    
    days.push(dayData);
  }

  console.log('✅ Días procesados:', days.map(d => `${d.dayLabel} (${d.date})`));
  return days;
};

// Función getWindDirection (asegúrate de que esté disponible)
const getWindDirection = (degrees) => {
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

// Hook principal
export const useWeather = (customLocation = { lat: -31.5375, lng: -68.5364 }) => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAllWeatherData = async (location = customLocation) => {
    try {
      const [currentResponse, forecastResponse] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lng}&appid=${API_KEY}&units=metric&lang=es`),
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lng}&hourly=temperature_2m,wind_speed_10m,wind_gusts_10m,wind_direction_10m,precipitation,precipitation_probability,weather_code&timezone=auto&forecast_days=7`)
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
    fetchAllWeatherData(customLocation);
  }, [customLocation.lat, customLocation.lng]);

  return { 
    currentWeather, 
    hourlyForecast, 
    loading, 
    refetch: fetchAllWeatherData 
  };
};

// Exportar getWindDirection como función independiente
export { getWindDirection };