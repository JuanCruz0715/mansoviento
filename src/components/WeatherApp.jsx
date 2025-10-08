import { useState } from 'react';
import { useWeather } from '../hooks/useWeather';
import { useSkyAnimation } from '../hooks/useSkyAnimation';
import { getWindDirection } from '../utils/windUtils';
import { AnimatedSky } from '../components/AnimatedSky';
import { CurrentWeather } from '../components/CurrentWeather';
import { WeatherForecast } from '../components/WeatherForecast';

export default function WeatherApp() {
  const [selectedLocation] = useState({
    lat: -31.5375,
    lng: -68.5364,
    name: 'San Juan, Argentina'
  });
  
  const { currentWeather, hourlyForecast, loading } = useWeather(selectedLocation);
  const sky = useSkyAnimation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center p-4">
        <div className="text-gray-800 text-lg sm:text-xl text-center">Cargando datos meteorológicos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <AnimatedSky />
      
      <div className="relative z-10 p-3 sm:p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Clima actual */}
          <CurrentWeather 
            currentWeather={currentWeather} 
            getWindDirection={getWindDirection}
            sky={sky}
            customLocation={selectedLocation}
          />
          
          {/* Pronóstico */}
          <WeatherForecast hourlyForecast={hourlyForecast} />
        </div>
      </div>
    </div>
  );
}