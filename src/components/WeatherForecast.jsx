import { useState } from 'react';
import { Calendar, AlertTriangle } from 'lucide-react';

import WeatherHourlyGrid from './WeatherHourlyGrid';
import { getWindType } from '../utils/windUtils';

export const WeatherForecast = ({ hourlyForecast }) => {
  const [selectedDay, setSelectedDay] = useState(0);

  if (!hourlyForecast || hourlyForecast.length === 0) return null;

  const day = hourlyForecast[selectedDay];

  return (
    <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/20 p-5 sm:p-6">

      {/* HEADER */}
      <div className="flex items-center gap-2 mb-5">
        <Calendar className="w-4 h-4 text-cyan-400" strokeWidth={1.5} />
        <h3 className="text-sm font-medium text-white/80 uppercase tracking-wider">
          Pronóstico · 7 días
        </h3>
      </div>

      {/* GRILLA HORARIA DEL DÍA SELECCIONADO */}
      <div className="mb-4">
        <WeatherHourlyGrid day={day} />
      </div>

      {/* DOTS DE NAVEGACIÓN (estilo Instagram) */}
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
      {/* Dots más grandes y separados */}
      <div className="flex items-center gap-2.5">
        {days.map((day, index) => {
          const isActive = selectedDay === index;

          return (
            <button
              key={day.date}
              onClick={() => onSelectDay(index)}
              className={`rounded-full transition-all duration-200 ${
                isActive
                  ? 'w-8 h-2.5 bg-cyan-400 shadow-lg shadow-cyan-400/50'
                  : 'w-2.5 h-2.5 bg-white/25 hover:bg-white/50 hover:scale-110'
              }`}
              aria-label={`Día ${index + 1}`}
            />
          );
        })}
      </div>

      {/* Etiqueta del día activo más grande y visible */}
      <p className="text-sm text-white/70 font-medium tracking-wide">
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
      <div className="p-4 text-center bg-emerald-500/10 border border-emerald-400/30 rounded-2xl">
        <p className="text-emerald-300 font-medium text-sm">
          ✅ No se esperan condiciones críticas este día
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-4 h-4 text-amber-400" strokeWidth={1.5} />
        <h4 className="text-[10px] uppercase tracking-widest text-white/50 font-medium">
          Horarios importantes
        </h4>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {critical.map((h, i) => (
          <div
            key={i}
            className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/30"
          >
            <p className="font-semibold text-sm text-white">
              {h.hour}:00 hs · {h.windGusts} km/h
            </p>
            <p className="text-xs text-white/60 mt-1">
              Dirección: {h.windInfo.direction} {h.windInfo.arrow}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};