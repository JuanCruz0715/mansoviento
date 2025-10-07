import { Thermometer, Wind, CloudRain, Navigation, MapPin, Eye } from 'lucide-react';

export const CurrentWeather = ({ currentWeather, getWindDirection }) => {
  if (!currentWeather) return null;

  const metrics = [
    {
      icon: Thermometer,
      value: `${Math.round(currentWeather.main.feels_like)}°`,
      label: 'Sensación Térmica',
      color: 'text-orange-500'
    },
    {
      icon: CloudRain,
      value: `${currentWeather.main.humidity}%`,
      label: 'Humedad',
      color: 'text-blue-500'
    },
    {
      icon: Wind,
      value: `${(currentWeather.wind.speed * 3.6).toFixed(0)} km/h`,
      label: 'Viento',
      subtext: `${getWindDirection(currentWeather.wind.deg).arrow} ${getWindDirection(currentWeather.wind.deg).direction}`,
      color: 'text-green-500'
    },
    {
      icon: Navigation,
      value: `${currentWeather.main.pressure} hPa`,
      label: 'Presión',
      color: 'text-purple-500'
    },
    {
      icon: Eye,
      value: `${(currentWeather.visibility / 1000).toFixed(1)} km`,
      label: 'Visibilidad',
      color: 'text-cyan-500'
    }
  ];

  return (
    <div className="glass-effect rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-4 sm:mb-6">
      {/* Header elegante */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <MapPin className="w-5 h-5 text-gray-600" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">San Juan, Argentina</h1>
        </div>
        <div className="flex items-center justify-center gap-4">
          <div className="text-5xl sm:text-6xl font-bold text-gray-800">
            {Math.round(currentWeather.main.temp)}°
          </div>
          <div className="text-left">
            <p className="text-lg text-gray-600 capitalize font-medium">
              {currentWeather.weather[0].description}
            </p>
            <p className="text-sm text-gray-500">
              Sensación: {Math.round(currentWeather.main.feels_like)}°
            </p>
          </div>
        </div>
      </div>

      {/* Grid de métricas moderno */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white/50 backdrop-blur-sm rounded-xl p-3 text-center border border-white/40">
            <metric.icon className={`w-6 h-6 mx-auto mb-2 ${metric.color}`} />
            <div className="text-lg font-bold text-gray-800">{metric.value}</div>
            <div className="text-xs text-gray-600">{metric.label}</div>
            {metric.subtext && <div className="text-xs text-gray-500 mt-1">{metric.subtext}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};