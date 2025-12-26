import { useState, useEffect } from 'react';

const API_KEY = 'a4bc9566579c0764802ec6e156db2b2a';

// Función auxiliar para procesar datos horarios
const processHourlyData = (data) => {
  const days = [];
  
  const now = new Date();
  const today = now.toDateString();
  
  console.log('🔄 VERSIÓN EMERGENCIA - HOY:', today);

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

// Función getWindDirection
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
      console.log('📍 Fetching weather for:', location.name, location.lat, location.lng);
      
      const [currentResponse, forecastResponse] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lng}&appid=${API_KEY}&units=metric&lang=es`),
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lng}&hourly=temperature_2m,wind_speed_10m,wind_gusts_10m,wind_direction_10m,precipitation,precipitation_probability,weather_code&timezone=auto&forecast_days=7`)
      ]);

      if (!currentResponse.ok || !forecastResponse.ok) {
        throw new Error('Error en la respuesta de la API');
      }

      const [currentData, forecastData] = await Promise.all([
        currentResponse.json(),
        forecastResponse.json()
      ]);

      console.log('✅ Datos recibidos para:', location.name);
      setCurrentWeather(currentData);
      setHourlyForecast(processHourlyData(forecastData));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching weather:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchAllWeatherData(customLocation);
  }, [customLocation.lat, customLocation.lng]);

  return { 
    currentWeather, 
    hourlyForecast, 
    loading, 
    refetch: () => fetchAllWeatherData(customLocation) 
  };
};

// ============================================================================
// 🔔 SISTEMA DE ALERTAS
// ============================================================================

// Función para clasificar el tipo de viento (para detectar Zonda)
const getWindType = (degrees) => {
  // ZONDA: Viento del cuadrante Oeste (entre 247.5° y 292.5°)
  if (degrees >= 247.5 && degrees < 292.5) {
    return { 
      type: 'ZONDA', 
      description: 'Viento Zonda',
      color: 'text-orange-600',
      emoji: '🌪️'
    };
  }
  
  // SUR: Viento del Sur (entre 157.5° y 202.5°)
  if (degrees >= 157.5 && degrees < 202.5) {
    return { 
      type: 'SUR', 
      description: 'Viento Sur',
      color: 'text-blue-600',
      emoji: '⬇️'
    };
  }
  
  // Para otras direcciones
  if (degrees >= 22.5 && degrees < 67.5) return { type: 'NE', description: 'Noreste', color: 'text-gray-600', emoji: '↗️' };
  if (degrees >= 67.5 && degrees < 112.5) return { type: 'E', description: 'Este', color: 'text-gray-600', emoji: '➡️' };
  if (degrees >= 112.5 && degrees < 157.5) return { type: 'SE', description: 'Sureste', color: 'text-gray-600', emoji: '↘️' };
  if (degrees >= 202.5 && degrees < 247.5) return { type: 'SW', description: 'Suroeste', color: 'text-gray-600', emoji: '↙️' };
  if (degrees >= 292.5 && degrees < 337.5) return { type: 'NW', description: 'Noroeste', color: 'text-gray-600', emoji: '↖️' };
  if (degrees >= 337.5 || degrees < 22.5) return { type: 'N', description: 'Norte', color: 'text-red-600', emoji: '⬆️' };
  
  return { type: '-', description: 'Calma', color: 'text-gray-500', emoji: '🌤️' };
};

// Función para obtener resumen del día
const getDaySummary = (day) => {
  const temperatures = day.hours.map(h => h.temperature);
  const windGusts = day.hours.map(h => h.windGusts);
  const precipitation = day.hours.map(h => h.precipitation);
  
  // Encontrar viento predominante
  const windDirections = day.hours.map(h => h.windInfo.direction);
  const windCount = windDirections.reduce((acc, direction) => {
    acc[direction] = (acc[direction] || 0) + 1;
    return acc;
  }, {});
  
  const predominantWind = Object.keys(windCount).reduce((a, b) => 
    windCount[a] > windCount[b] ? a : b
  );

  return {
    tempMax: Math.max(...temperatures),
    tempMin: Math.min(...temperatures),
    maxWindGusts: Math.max(...windGusts),
    totalPrecipitation: precipitation.reduce((sum, prec) => sum + prec, 0),
    hasDangerousWinds: Math.max(...windGusts) > 70,
    hasRain: precipitation.some(prec => prec > 0),
    predominantWind: predominantWind,
    windArrow: day.hours.find(h => h.windInfo.direction === predominantWind)?.windInfo.arrow || '⬆️'
  };
};

// Hook para detectar alertas climáticas futuras
export const useWeatherAlerts = (hourlyForecast) => {
  const detectAlerts = () => {
    if (!hourlyForecast) return [];
    
    const alerts = [];
    const today = new Date();
    const twoDaysFromNow = new Date(today);
    twoDaysFromNow.setDate(today.getDate() + 2);

    // Analizar los próximos 2 días
    hourlyForecast.forEach(day => {
      const dayDate = new Date(day.date);
      
      // Solo analizar días dentro de los próximos 2 días
      if (dayDate <= twoDaysFromNow) {
        const daySummary = getDaySummary(day);
        
        // 🌪️ Detectar Zonda futuro (> 45 km/h)
        const zondaHours = day.hours.filter(hour => {
          const windType = getWindType(hour.windDirection);
          return (windType.type === 'ZONDA' && hour.windGusts > 45);
        });
        
        if (zondaHours.length > 0) {
          const maxZonda = Math.max(...zondaHours.map(h => h.windGusts));
          alerts.push({
            type: 'ZONDA',
            severity: maxZonda > 60 ? 'high' : 'medium',
            date: day.date,
            message: `Viento Zonda hasta ${maxZonda} km/h`,
            maxGusts: maxZonda,
            hours: zondaHours
          });
        }
        
        // ⬇️ Detectar viento Sur fuerte futuro (> 50 km/h)
        const surHours = day.hours.filter(hour => {
          const windType = getWindType(hour.windDirection);
          return ((windType.type === 'SUR' || hour.windInfo.direction === 'S') && hour.windGusts > 50);
        });
        
        if (surHours.length > 0) {
          const maxSur = Math.max(...surHours.map(h => h.windGusts));
          alerts.push({
            type: 'SUR',
            severity: maxSur > 70 ? 'high' : 'medium',
            date: day.date,
            message: `Viento Sur hasta ${maxSur} km/h`,
            maxGusts: maxSur,
            hours: surHours
          });
        }
        
        // 🌧️ Detectar lluvia significativa futura (> 0.5mm)
        if (daySummary.totalPrecipitation > 0.5) {
          let severity = 'low';
          let intensity = 'leve';
          
          if (daySummary.totalPrecipitation > 5) {
            severity = 'high';
            intensity = 'intensa';
          } else if (daySummary.totalPrecipitation > 2) {
            severity = 'medium';
            intensity = 'moderada';
          }
          
          alerts.push({
            type: 'LLUVIA',
            severity: severity,
            date: day.date,
            message: `Lluvia ${intensity}: ${daySummary.totalPrecipitation.toFixed(1)} mm esperados`,
            totalPrecipitation: daySummary.totalPrecipitation
          });
        }
        
        // ⚠️ Detectar viento peligroso futuro (> 70 km/h)
        if (daySummary.hasDangerousWinds) {
          alerts.push({
            type: 'VIENTO_PELIGROSO',
            severity: 'high',
            date: day.date,
            message: `Viento peligroso: ráfagas hasta ${daySummary.maxWindGusts} km/h`,
            maxGusts: daySummary.maxWindGusts
          });
        }
      }
    });
    
    return alerts;
  };

  return { alerts: detectAlerts() };
};

// Exportar getWindDirection como función independiente
export { getWindDirection };