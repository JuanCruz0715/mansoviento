import { Thermometer, Wind, CloudRain, Navigation, MapPin, Eye } from 'lucide-react';

export const CurrentWeather = ({ currentWeather, getWindDirection, customLocation }) => {
  if (!currentWeather) return null;

  const metrics = [
    { icon: Thermometer, value: `${Math.round(currentWeather.main.feels_like)}°`, label: 'Sens. Térmica' },
    { icon: CloudRain, value: `${currentWeather.main.humidity}%`, label: 'Humedad' },
    { icon: Wind, value: `${(currentWeather.wind.speed * 3.6).toFixed(0)} km/h`, label: 'Viento', subtext: getWindDirection(currentWeather.wind.deg).direction },
    { icon: Navigation, value: `${currentWeather.main.pressure} hPa`, label: 'Presión' },
    { icon: Eye, value: `${(currentWeather.visibility / 1000).toFixed(1)} km`, label: 'Visibilidad' },
  ];

  return (
    <div className="rounded-xl bg-[#0f0f11] border border-white/5 p-5 shadow-xl">
      {/* Header de la tarjeta */}
      <div className="flex items-center gap-2 mb-5 pb-3 border-b border-white/5">
        <MapPin className="w-4 h-4 text-amber-500" strokeWidth={1.5} />
        <h3 className="text-xs font-bold text-white/90 uppercase tracking-widest">
          Condiciones Actuales
        </h3>
      </div>

      {/* Temperatura */}
      <div className="flex items-end gap-4 mb-6">
        <div className="text-6xl font-light text-white tracking-tighter leading-none">
          {Math.round(currentWeather.main.temp)}°
        </div>
        <div className="pb-1">
          <p className="text-sm text-white capitalize font-medium leading-tight">
            {currentWeather.weather[0].description}
          </p>
          <p className="text-[10px] text-amber-500/80 uppercase tracking-wider mt-1">
            {customLocation?.name || 'San Juan'}
          </p>
        </div>
      </div>

      {/* Grid de métricas (estilo líneas limpias) */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-5">
        {metrics.map((metric, index) => (
          <div key={index} className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-white/40">
              <metric.icon className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span className="text-[10px] uppercase tracking-wider">{metric.label}</span>
            </div>
            <div className="text-lg font-medium text-white/90">
              {metric.value}
              {metric.subtext && (
                <span className="text-xs text-white/40 ml-1.5 font-normal">{metric.subtext}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};