import { useWeather } from '../hooks/useWeather';
import { useSkyAnimation } from '../hooks/useSkyAnimation';
import { AnimatedSky } from '../components/AnimatedSky';
import { CurrentWeather } from '../components/CurrentWeather';
import { WeatherForecast } from '../components/WeatherForecast';
import { getWindDirection } from '../hooks/useWeather';

export default function WeatherApp() {
  const { currentWeather, hourlyForecast, loading } = useWeather();
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
          
          <div className="text-center mb-2">
            <div className="inline-block bg-white/80 backdrop-blur-md rounded-full px-4 py-1 border border-white/30">
              <p className="text-gray-800 text-sm">
                {sky.celestialBody} {sky.timeOfDay} • {new Date().toLocaleTimeString('es-AR', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: false 
                })}
              </p>
            </div>
          </div>

          <CurrentWeather currentWeather={currentWeather} getWindDirection={getWindDirection} />
          <WeatherForecast hourlyForecast={hourlyForecast} />

          <div className="text-center mt-4 sm:mt-6">
            <div className="inline-block bg-white/80 backdrop-blur-md rounded-full px-3 sm:px-4 py-1 sm:py-2 border border-white/30">
              <p className="text-gray-600 text-xs">
                BY JUAN CRUZ REINOSO
              </p>
              <p className="text-gray-600 text-xs">
                Datos actuales: OpenWeatherMap • Pronóstico: Open-Meteo
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}