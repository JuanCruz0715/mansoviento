import { Thermometer, Wind, CloudRain, Navigation, MapPin, Eye } from 'lucide-react';

export const CurrentWeather = ({ currentWeather, getWindDirection, customLocation }) => {
  if (!currentWeather) return null;

  const metrics = [
    {
      icon: Thermometer,
      value: `${Math.round(currentWeather.main.feels_like)}°`,
      label: 'Sensación',
    },
    {
      icon: CloudRain,
      value: `${currentWeather.main.humidity}%`,
      label: 'Humedad',
    },
    {
      icon: Wind,
      value: `${(currentWeather.wind.speed * 3.6).toFixed(0)} km/h`,
      label: 'Viento',
      subtext: `${getWindDirection(currentWeather.wind.deg).arrow} ${getWindDirection(currentWeather.wind.deg).direction}`,
    },
    {
      icon: Navigation,
      value: `${currentWeather.main.pressure}`,
      label: 'hPa',
    },
    {
      icon: Eye,
      value: `${(currentWeather.visibility / 1000).toFixed(1)} km`,
      label: 'Visibilidad',
    },
  ];

  return (
    <div className="relative rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 sm:p-8 mb-4 sm:mb-6 shadow-2xl shadow-black/20">

      {/* Ubicación */}
      <div className="flex items-center gap-2 mb-6">
        <MapPin className="w-4 h-4 text-cyan-400" strokeWidth={1.5} />
        <span className="text-sm font-medium text-white/80 uppercase tracking-wider">
          {customLocation?.name || 'San Juan, Argentina'}
        </span>
      </div>

      {/* Temperatura principal */}
      <div className="flex items-end gap-6 mb-8">
        <div className="text-7xl sm:text-8xl font-bold text-white tracking-tighter leading-none">
          {Math.round(currentWeather.main.temp)}°
        </div>
        <div className="pb-2">
          <p className="text-lg text-white/90 capitalize font-medium">
            {currentWeather.weather[0].description}
          </p>
          <p className="text-sm text-white/50 mt-1">
            Sensación {Math.round(currentWeather.main.feels_like)}°
          </p>
        </div>
      </div>

      {/* Grid de métricas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="rounded-2xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition-colors duration-200"
          >
            <metric.icon className="w-4 h-4 text-cyan-400 mb-3" strokeWidth={1.5} />
            <div className="text-xl font-semibold text-white tracking-tight">
              {metric.value}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-white/40 mt-1">
              {metric.label}
            </div>
            {metric.subtext && (
              <div className="text-xs text-white/60 mt-1">{metric.subtext}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};