// Exportar getWindDirection desde aquí también
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

export const getWindType = (degrees) => {
  if (degrees >= 270 && degrees < 330) {
    return { type: 'ZONDA', emoji: '🌡️', description: 'Viento cálido y seco del Oeste/Noroeste', color: 'text-orange-600' };
  }
  else if (degrees >= 150 && degrees < 210) {
    return { type: 'SUR', emoji: '❄️', description: 'Viento frío del Sur', color: 'text-blue-600' };
  }
  else if (degrees >= 330 || degrees < 30) {
    return { type: 'NORTE', emoji: '🔥', description: 'Viento cálido del Norte', color: 'text-red-600' };
  }
  else if (degrees >= 60 && degrees < 120) {
    return { type: 'ESTE', emoji: '💧', description: 'Viento húmedo del Este', color: 'text-cyan-600' };
  }
  else if (degrees >= 240 && degrees < 270) {
    return { type: 'OESTE', emoji: '💨', description: 'Viento del Oeste', color: 'text-yellow-600' };
  }
  else {
    return { type: 'OTRO', emoji: '🌬️', description: 'Viento variable', color: 'text-gray-600' };
  }
};

export const getDaySummary = (dayData) => {
  const hours = dayData.hours;
  const windDirections = hours.map(h => h.windInfo.direction);
  const windCount = {};
  windDirections.forEach(dir => { windCount[dir] = (windCount[dir] || 0) + 1; });
  const predominantWind = Object.keys(windCount).reduce((a, b) => windCount[a] > windCount[b] ? a : b);
  const sampleHour = hours.find(h => h.windInfo.direction === predominantWind);

  return {
    tempMax: Math.max(...hours.map(h => h.temperature)),
    tempMin: Math.min(...hours.map(h => h.temperature)),
    maxWindGusts: Math.max(...hours.map(h => h.windGusts)),
    totalPrecipitation: hours.reduce((sum, h) => sum + h.precipitation, 0),
    hasDangerousWinds: hours.some(h => h.isDangerous),
    hasRain: hours.some(h => h.precipitation > 0),
    predominantWind,
    predominantWindType: sampleHour ? getWindType(sampleHour.windDirection) : null,
    windArrow: sampleHour?.windInfo.arrow || '🌬️'
  };
};