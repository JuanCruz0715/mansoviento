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
  
  let background, celestialBody, timeOfDay, sunGlow, moonGlow;
  
  // Gradiente de luz de izquierda a derecha que representa sol -> luna
  
  if (hour >= 5 && hour < 8) {
    // Amanecer - Sol amarillo/naranja brillante a la izquierda, suave a la derecha
    background = '#E8F4F8'; // Fondo celeste suave
    sunGlow = 'radial-gradient(ellipse 800px 400px at 0% 0%, rgba(255, 220, 100, 0.6) 0%, rgba(255, 180, 80, 0.3) 30%, transparent 70%)';
    moonGlow = 'radial-gradient(ellipse 600px 300px at 100% 0%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)';
    celestialBody = '🌅';
    timeOfDay = 'Amanecer';
  } else if (hour >= 8 && hour < 12) {
    // Mañana - Sol amarillo brillante a la izquierda
    background = '#E3F2FD';
    sunGlow = 'radial-gradient(ellipse 900px 450px at 0% 0%, rgba(255, 235, 120, 0.7) 0%, rgba(255, 200, 100, 0.4) 30%, transparent 70%)';
    moonGlow = 'radial-gradient(ellipse 500px 250px at 100% 0%, rgba(245, 245, 255, 0.15) 0%, transparent 50%)';
    celestialBody = '☀️';
    timeOfDay = 'Mañana';
  } else if (hour >= 12 && hour < 16) {
    // Mediodía - Sol muy brillante a la izquierda
    background = '#87CEEB';
    sunGlow = 'radial-gradient(ellipse 1000px 500px at 0% 0%, rgba(255, 245, 140, 0.8) 0%, rgba(255, 220, 120, 0.5) 30%, transparent 70%)';
    moonGlow = 'radial-gradient(ellipse 400px 200px at 100% 0%, rgba(240, 240, 250, 0.2) 0%, transparent 50%)';
    celestialBody = '🔆';
    timeOfDay = 'Mediodía';
  } else if (hour >= 16 && hour < 19) {
    // Tarde - Sol dorado/naranja a la izquierda
    background = '#FFD9A0';
    sunGlow = 'radial-gradient(ellipse 850px 425px at 0% 0%, rgba(255, 180, 80, 0.75) 0%, rgba(255, 140, 60, 0.45) 30%, transparent 70%)';
    moonGlow = 'radial-gradient(ellipse 550px 275px at 100% 0%, rgba(255, 250, 240, 0.2) 0%, transparent 50%)';
    celestialBody = '🌇';
    timeOfDay = 'Tarde';
  } else if (hour >= 19 && hour < 21) {
    // Atardecer - Sol rojizo/naranja apagándose, luna empezando a brillar
    background = '#6A4C93';
    sunGlow = 'radial-gradient(ellipse 700px 350px at 0% 0%, rgba(255, 120, 60, 0.5) 0%, rgba(200, 80, 100, 0.3) 30%, transparent 70%)';
    moonGlow = 'radial-gradient(ellipse 650px 325px at 100% 0%, rgba(255, 255, 255, 0.35) 0%, rgba(220, 220, 255, 0.2) 40%, transparent 60%)';
    celestialBody = '🌆';
    timeOfDay = 'Atardecer';
  } else {
    // Noche - Fondo oscuro, sol apagado, luna blanca brillante a la derecha
    background = '#0D1B2A';
    sunGlow = 'radial-gradient(ellipse 400px 200px at 0% 0%, rgba(100, 100, 150, 0.15) 0%, transparent 50%)';
    moonGlow = 'radial-gradient(ellipse 700px 350px at 100% 0%, rgba(255, 255, 255, 0.5) 0%, rgba(220, 230, 255, 0.3) 40%, transparent 70%)';
    celestialBody = '🌙';
    timeOfDay = 'Noche';
  }
  
  return {
    position: `${position}%`,
    celestialBody,
    isDay,
    background,
    sunGlow,
    moonGlow,
    timeOfDay,
    hour: now.getHours(),
    minutes: now.getMinutes()
  };
};