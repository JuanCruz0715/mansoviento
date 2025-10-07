import { useState, useEffect } from 'react';

export const useSkyAnimation = () => {
  const [sky, setSky] = useState(getSkyStyle());

  useEffect(() => {
    const interval = setInterval(() => {
      setSky(getSkyStyle());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return sky;
};

const getSkyStyle = () => {
  const now = new Date();
  const hour = now.getHours();
  const minutes = now.getMinutes();
  const totalMinutes = hour * 60 + minutes;
  const position = (totalMinutes / (24 * 60)) * 100;
  const isDay = hour >= 6 && hour < 20;
  
  // Estilo Google Weather / Clima del Celular
  let background, celestialBody, timeOfDay;
  
  if (hour >= 5 && hour < 8) {
    // Amanecer - Gradiente suave naranja/azul
    background = 'linear-gradient(135deg, #FFEED9 0%, #B3D9FF 100%)';
    celestialBody = '🌅';
    timeOfDay = 'Amanecer';
  } else if (hour >= 8 && hour < 12) {
    // Mañana - Azul claro muy suave
    background = 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 50%, #90CAF9 100%)';
    celestialBody = '☀️';
    timeOfDay = 'Mañana';
  } else if (hour >= 12 && hour < 16) {
    // Mediodía - Azul cielo vibrante
    background = 'linear-gradient(135deg, #87CEEB 0%, #B3E5FC 50%, #E1F5FE 100%)';
    celestialBody = '🔆';
    timeOfDay = 'Mediodía';
  } else if (hour >= 16 && hour < 19) {
    // Tarde - Gradiente dorado/naranja
    background = 'linear-gradient(135deg, #FFD54F 0%, #FFB74D 50%, #FF8A65 100%)';
    celestialBody = '🌇';
    timeOfDay = 'Tarde';
  } else if (hour >= 19 && hour < 21) {
    // Atardecer - Púrpura/naranja
    background = 'linear-gradient(135deg, #6A1B9A 0%, #E91E63 50%, #FF9800 100%)';
    celestialBody = '🌆';
    timeOfDay = 'Atardecer';
  } else {
    // Noche - Azul oscuro/índigo
    background = 'linear-gradient(135deg, #0D47A1 0%, #1A237E 50%, #311B92 100%)';
    celestialBody = '🌙';
    timeOfDay = 'Noche';
  }
  
  return {
    position: `${position}%`,
    celestialBody,
    isDay,
    background,
    timeOfDay,
    hour: now.getHours(),
    minutes: now.getMinutes()
  };
};