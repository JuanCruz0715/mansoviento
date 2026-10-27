import { useState } from 'react';
import { Calendar, AlertTriangle, Wind, Thermometer, CloudRain, Navigation } from 'lucide-react';
import WeatherHourlyGrid from './WeatherHourlyGrid';
import { getDaySummary, getWindType } from '../utils/windUtils';

export const WeatherForecast = ({ hourlyForecast }) => {
  const [selectedDay, setSelectedDay] = useState(0);

  if (!hourlyForecast || hourlyForecast.length === 0) return null;

  const day = hourlyForecast[selectedDay];

  return (
    <div className="rounded-xl bg-[#0f0f11] border border-white/5 p-4 sm:p-5 shadow-xl">

      {/* HEADER */}
      <div className="flex items-center gap-2 mb-5 pb-3 border-b border-white/5">
        <Calendar className="w-4 h-4 text-amber-500" strokeWidth={1.5} />
        <h3 className="text-xs font-bold text-white/90 uppercase tracking-widest">
          Pronóstico · 7 días
        </h3>
      </div>

      {/* GRILLA HORARIA DEL DÍA SELECCIONADO */}
      <div className="mb-4">
        <WeatherHourlyGrid day={day} />
      </div>

      {/* DOTS DE NAVEGACIÓN */}
      <DayDots
        days={hourlyForecast}
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
      />

      {/* HORAS CRÍTICAS */}
      <div className="mt-5">
        <CriticalHours hours={day.hours} />
      </div>

    </div>
  );
};

/* ===========================
   DOTS DE NAVEGACIÓN
=========================== */

const DayDots = ({ days, selectedDay, onSelectDay }) => {
  const getDayLabel = (dateString, index) => {
    if (index === 0) return 'Hoy';
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, month - 1, day);
    const name = date.toLocaleDateString('es-AR', { weekday: 'long' });
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <div className="flex items-center gap-2.5">
        {days.map((day, index) => {
          const isActive = selectedDay === index;
          return (
            <button
              key={day.date}
              onClick={() => onSelectDay(index)}
              className={`rounded-full transition-all duration-200 ${
                isActive
                  ? 'w-8 h-2 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                  : 'w-2 h-2 bg-white/20 hover:bg-white/40 hover:scale-110'
              }`}
              aria-label={`Día ${index + 1}`}
            />
          );
        })}
      </div>
      <p className="text-[10px] text-amber-500/80 font-bold uppercase tracking-widest">
        {getDayLabel(days[selectedDay].date, selectedDay)}
      </p>
    </div>
  );
};

/* ===========================
   HORAS CRÍTICAS
=========================== */

const CriticalHours = ({ hours }) => {
  const critical = hours.filter(
    (h) =>
      h.isDangerous ||
      h.precipitation > 2 ||
      (getWindType(h.windDirection).type === 'ZONDA' && h.windGusts > 45)
  );

  if (critical.length === 0) {
    return (
      <div className="p-3 text-center bg-[#050505] border border-white/5 rounded-lg">
        <p className="text-emerald-500/80 font-bold text-[10px] uppercase tracking-wider">
          ✓ Condiciones estables
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-4 h-4 text-red-500" strokeWidth={1.5} />
        <h4 className="text-[10px] uppercase tracking-widest text-red-400 font-bold">
          Horarios importantes
        </h4>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {critical.map((h, i) => (
          <div key={i} className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="font-bold text-xs text-white uppercase tracking-wider">
              {h.hour}:00 hs <span className="text-red-400 ml-1">({h.windGusts} km/h)</span>
            </p>
            <p className="text-[10px] text-white/50 mt-1 uppercase tracking-wider">
              Dir: {h.windInfo.direction}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};