import { Thermometer, Wind, CloudRain, Navigation, MapPin, Eye } from 'lucide-react';

export const CurrentWeather = ({ currentWeather, getWindDirection, customLocation }) => {
  if (!currentWeather) return null;

  const metrics = [
    { icon: Thermometer, value: `${Math.round(currentWeather.main.feels_like)}°`, label: 'Sens.' },
    { icon: CloudRain, value: `${currentWeather.main.humidity}%`, label: 'Humedad' },
    {
      icon: Wind,
      value: `${(currentWeather.wind.speed * 3.6).toFixed(0)}`,
      label: 'Viento km/h',
      subtext: `${getWindDirection(currentWeather.wind.deg).arrow}`,
    },
    { icon: Navigation, value: `${currentWeather.main.pressure}`, label: 'hPa' },
    { icon: Eye, value: `${(currentWeather.visibility / 1000).toFixed(1)}`, label: 'Vis. km' },
  ];

  return (
    <div className="relative rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-5 shadow-2xl shadow-black/20">
      
      {/* Ubicación */}
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-4 h-4 text-cyan-400" strokeWidth={1.5} />
        <span className="text-[10px] font-medium text-white/80 uppercase tracking-wider">
          {customLocation?.name || 'San Juan'}
        </span>
      </div>

      {/* Temperatura principal */}
      <div className="flex items-end gap-3 mb-6">
        <div className="text-6xl font-bold text-white tracking-tighter leading-none">
          {Math.round(currentWeather.main.temp)}°
        </div>
        <div className="pb-1">
          <p className="text-sm text-white/90 capitalize font-medium leading-tight">
            {currentWeather.weather[0].description}
          </p>
          <p className="text-[10px] text-white/50 mt-0.5">
            Sensación {Math.round(currentWeather.main.feels_like)}°
          </p>
        </div>
      </div>

      {/* Grid de métricas (apilado para columna angosta) */}
      <div className="grid grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="rounded-xl bg-white/5 border border-white/5 p-2.5 flex items-center gap-3 hover:bg-white/10 transition-colors duration-200"
          >
            <metric.icon className="w-4 h-4 text-cyan-400 flex-shrink-0" strokeWidth={1.5} />
            <div className="flex flex-col min-w-0">
              <div className="text-sm font-semibold text-white tracking-tight leading-none">
                {metric.value}
              </div>
              <div className="text-[9px] uppercase tracking-widest text-white/40 mt-0.5 truncate">
                {metric.label}
              </div>
            </div>
            {metric.subtext && (
              <div className="ml-auto text-xs text-white/60">{metric.subtext}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};