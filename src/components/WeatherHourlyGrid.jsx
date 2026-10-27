import { useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';

const getWeatherIcon = (code) => {
  if (!code) return '☁️';
  if (code >= 200 && code < 300) return '⛈️';
  if (code >= 300 && code < 400) return '🌦️';
  if (code >= 500 && code < 600) return '🌧️';
  if (code >= 600 && code < 700) return '❄️';
  if (code >= 700 && code < 800) return '🌫️';
  if (code === 800) return '☀️';
  if (code === 801) return '🌤️';
  if (code === 802) return '⛅';
  if (code === 803 || code === 804) return '☁️';
  return '☁️';
};

const getWindColor = (speed) => {
  if (speed < 12) return 'text-cyan-300';
  if (speed < 20) return 'text-emerald-300';
  if (speed < 30) return 'text-yellow-300';
  if (speed < 40) return 'text-amber-400';
  if (speed < 50) return 'text-orange-400';
  if (speed < 60) return 'text-red-400';
  return 'text-red-500 font-bold';
};

const getWindBarBg = (speed) => {
  if (speed < 12) return 'bg-cyan-400';
  if (speed < 20) return 'bg-emerald-400';
  if (speed < 30) return 'bg-yellow-400';
  if (speed < 40) return 'bg-amber-400';
  if (speed < 50) return 'bg-orange-400';
  if (speed < 60) return 'bg-red-400';
  return 'bg-red-500';
};

const isStrongGust = (windSpeed, windGusts) => {
  return windGusts > windSpeed * 1.8 && windGusts > 30;
};

const WindArrow = ({ degrees = 0, size = 12 }) => (
  <ArrowUp
    size={size}
    strokeWidth={2.5}
    className="text-cyan-400"
    style={{ transform: `rotate(${degrees + 180}deg)`, transition: 'transform 200ms ease' }}
  />
);

export default function WeatherHourlyGrid({ day }) {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  if (!day || !day.hours || day.hours.length === 0) {
    return (
      <div className="rounded-xl bg-[#0f0f11] border border-white/5 p-4">
        <p className="text-center text-white/50 text-xs py-2">Sin datos horarios</p>
      </div>
    );
  }

  const hours = day.hours;

  return (
    <div className="rounded-xl bg-[#0f0f11] border border-white/5 overflow-hidden">
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`w-full overflow-x-auto scrollbar-hide select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        <div className="min-w-max">
          {/* FILA: HORAS + ICONOS */}
          <div className="flex border-b border-white/5">
            <div className="w-20 flex-shrink-0 bg-[#050505] border-r border-white/5 flex items-end p-2 sticky left-0 z-10">
              <span className="text-[9px] uppercase tracking-widest text-white/40 font-bold">Horas</span>
            </div>
            <div className="flex">
              {hours.map((h, i) => (
                <div key={i} className="w-10 flex flex-col items-center py-1.5 border-r border-white/5 last:border-r-0">
                  <div className="text-[9px] text-white/50 mb-0.5">{h.hour}</div>
                  <div className="text-sm">{getWeatherIcon(h.weatherCode)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* TEMP */}
          <GridRow label="Temp" unit="°C">
            <div className="flex">
              {hours.map((h, i) => (
                <div key={i} className="w-10 py-1.5 text-center text-xs font-medium text-white/90 border-r border-white/5 last:border-r-0">
                  {h.temperature}°
                </div>
              ))}
            </div>
          </GridRow>

          {/* SENS */}
          <GridRow label="Sens." unit="°C">
            <div className="flex">
              {hours.map((h, i) => (
                <div key={i} className="w-10 py-1.5 text-center text-[10px] text-white/60 border-r border-white/5 last:border-r-0">
                  {h.feelsLike ? `${h.feelsLike}°` : '—'}
                </div>
              ))}
            </div>
          </GridRow>

          {/* LLUVIA */}
          <GridRow label="Lluvia" unit="mm">
            <div className="flex">
              {hours.map((h, i) => (
                <div key={i} className={`w-10 py-1.5 text-center text-[10px] border-r border-white/5 last:border-r-0 ${h.precipitation > 0 ? 'text-cyan-300 font-medium' : 'text-white/30'}`}>
                  {h.precipitation > 0 ? h.precipitation.toFixed(1) : '·'}
                </div>
              ))}
            </div>
          </GridRow>

          {/* VIENTO */}
          <GridRow label="Viento" unit="km/h">
            <div className="flex">
              {hours.map((h, i) => (
                <div key={i} className="w-10 py-1.5 flex flex-col items-center gap-0.5 border-r border-white/5 last:border-r-0">
                  <span className={`text-[10px] font-medium ${getWindColor(h.windSpeed)}`}>{h.windSpeed}</span>
                  <div className="w-6 h-0.5 rounded-full bg-white/10 overflow-hidden">
                    <div className={`h-full rounded-full ${getWindBarBg(h.windSpeed)}`} style={{ width: `${Math.min((h.windSpeed / 60) * 100, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </GridRow>

          {/* RACHAS */}
          <GridRow label="Rachas" unit="km/h">
            <div className="flex">
              {hours.map((h, i) => {
                const strong = isStrongGust(h.windSpeed, h.windGusts);
                return (
                  <div key={i} className="w-10 py-1.5 flex flex-col items-center gap-0.5 border-r border-white/5 last:border-r-0">
                    <span className={`text-[10px] font-medium ${strong ? 'text-amber-400 font-bold' : getWindColor(h.windGusts)}`}>{h.windGusts}</span>
                    <div className="w-6 h-0.5 rounded-full bg-white/10 overflow-hidden">
                      <div className={`h-full rounded-full ${strong ? 'bg-amber-400' : getWindBarBg(h.windGusts)}`} style={{ width: `${Math.min((h.windGusts / 60) * 100, 100)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </GridRow>

          {/* DIRECCIÓN */}
          <GridRow label="Direc." unit="">
            <div className="flex">
              {hours.map((h, i) => (
                <div key={i} className="w-10 py-1.5 flex items-center justify-center border-r border-white/5 last:border-r-0">
                  <WindArrow degrees={h.windDirection || 0} size={12} />
                </div>
              ))}
            </div>
          </GridRow>
        </div>
      </div>
      
      {/* Nota aclaratoria */}
      <div className="px-3 py-1.5 border-t border-white/5 bg-[#050505]/50">
        <p className="text-[8px] text-white/30 leading-tight uppercase tracking-wider">
          Viento: vel. sostenida · Rachas: máx. instantáneas
        </p>
      </div>
    </div>
  );
}

const GridRow = ({ label, unit, children }) => (
  <div className="flex border-b border-white/5 last:border-b-0">
    <div className="w-20 flex-shrink-0 bg-[#050505] border-r border-white/5 py-1.5 px-2 flex items-center justify-between sticky left-0 z-10">
      <span className="text-[9px] uppercase tracking-widest text-white/50 font-bold">{label}</span>
      {unit && <span className="text-[8px] text-white/30">{unit}</span>}
    </div>
    {children}
  </div>
);