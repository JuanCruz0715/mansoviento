import { useState } from 'react';
import { useWeather, useWeatherAlerts } from '../hooks/useWeather';
import { useSkyAnimation } from '../hooks/useSkyAnimation';
import { getWindDirection } from '../utils/windUtils';
import { AnimatedSky } from '../components/AnimatedSky';
import { CurrentWeather } from '../components/CurrentWeather';
import { WeatherForecast } from '../components/WeatherForecast';
import { DepartmentsCarousel } from '../components/DepartmentsCarousel';
import { NotificationManager } from '../components/NotificationManager';
import { WeatherAlerts } from '../components/WeatherAlerts';

export default function WeatherApp() {
  const [selectedLocation, setSelectedLocation] = useState({
    lat: -31.5375,
    lng: -68.5364,
    name: 'San Juan Capital',
    id: 'capital'
  });
  
  const { currentWeather, hourlyForecast, loading } = useWeather(selectedLocation);
  const { alerts } = useWeatherAlerts(hourlyForecast);
  const sky = useSkyAnimation();

  const handleDepartmentSelect = (department) => {
    setSelectedLocation({
      lat: department.lat,
      lng: department.lng,
      name: department.name,
      id: department.id
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center p-4">
        <div className="text-gray-800 text-lg sm:text-xl text-center">
          Cargando datos para {selectedLocation.name}...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <AnimatedSky />
      
      {/* Header minimalista */}
      <div className="relative z-20">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Desarrollado por <span className="font-semibold">[Juan Cruz Reinoso]</span> • 
              Datos de {' '}
              <a href="https://openweathermap.org/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                OpenWeather
              </a> y {' '}
              <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                Open-Meteo
              </a>
            </p>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 p-3 sm:p-4 md:p-6 isolate">
        <div className="max-w-6xl mx-auto">
          
          {/* Carrusel de Departamentos */}
          <DepartmentsCarousel 
            selectedDepartment={selectedLocation}
            onDepartmentSelect={handleDepartmentSelect}
          />
          
          {/* Alertas Climáticas Futuras */}
          <WeatherAlerts alerts={alerts} />
          
          {/* Gestor de Notificaciones */}
          <div className="mb-4">
            <NotificationManager />
          </div>
          
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