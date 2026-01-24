import { useState } from 'react';
import {
  Calendar,
  AlertTriangle,
  Wind,
  Thermometer,
  CloudRain,
  Navigation
} from 'lucide-react';

import WeatherHourlyGrid from './WeatherHourlyGrid';
import { getDaySummary, getWindType } from '../utils/windUtils';

export const WeatherForecast = ({ hourlyForecast }) => {
  const [selectedDay, setSelectedDay] = useState(0);

  if (!hourlyForecast) return null;

  return (
    <div className="glass-effect overflow-x-visible rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 border border-white/30 w-full">


      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Pronóstico {hourlyForecast.length} días
        </h2>
      </div>

      {/* TABS DE DÍAS */}
      <DayTabs
        days={hourlyForecast}
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
      />

      {/* DETALLE DEL DÍA SELECCIONADO */}
      <DayDetails day={hourlyForecast[selectedDay]} />
    </div>
  );
};

/* ===========================
   TABS DE DÍAS
=========================== */

const DayTabs = ({ days, selectedDay, onSelectDay }) => {
  const formatDate = (dateString) => {
    const [, month, day] = dateString.split('-');
    return `${day}/${month}`;
  };

  const getDayName = (dateString, index) => {
    if (index === 0) return 'HOY';

    const [year, month, day] = dateString.split('-');
    const date = new Date(year, month - 1, day);

    const name = date.toLocaleDateString('es-AR', { weekday: 'long' });
    return name.charAt(0).toUpperCase() + name.slice(1, 4);
  };

  return (
  <div className="mb-6">
    {/* MISMO ANCHO QUE DayDetails */}
    <div className="max-w-6xl mx-auto px-2">

      {/* SCROLL */}
      <div className="overflow-x-auto">
        <div className="flex gap-3 py-4 w-max mx-auto">

          {days.map((day, index) => {
            const summary = getDaySummary(day);

            return (
              <button
                key={day.date}
                onClick={() => onSelectDay(index)}
                className={`min-w-[140px] p-3 rounded-xl border-2 transition-all will-change-transform ${
                  selectedDay === index
                    ? 'bg-yellow-500/30 border-yellow-400 shadow-lg scale-105'
                    : 'bg-white/50 border-white/40 hover:bg-white/70'
                }`}
              >
                <div className="text-center space-y-2">
                  <p className="font-bold text-sm">
                    {getDayName(day.date, index)}
                  </p>

                  <p className="text-gray-600 text-sm">
                    {formatDate(day.date)}
                  </p>

                  <div className="flex justify-center gap-2">
                    <span className="font-bold text-lg">
                      {summary.tempMax}°
                    </span>
                    <span className="text-blue-600">
                      {summary.tempMin}°
                    </span>
                  </div>
                </div>
              </button>
            );
          })}

        </div>
      </div>
    </div>
  </div>
);
}

/* ===========================
   DETALLE DEL DÍA
=========================== */

const DayDetails = ({ day }) => {
  if (!day) return null;
  const summary = getDaySummary(day);

  return (
    <div className="bg-white/60 rounded-xl p-4 sm:p-6 border border-white/40">

      {/* RESUMEN */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <SummaryItem
          icon={Thermometer}
          label="Temp Máx/Mín"
          value={`${summary.tempMax}° / ${summary.tempMin}°`}
        />
        <SummaryItem
          icon={Wind}
          label="Rachas Máx"
          value={`${summary.maxWindGusts} km/h`}
        />
        <SummaryItem
          icon={CloudRain}
          label="Lluvia"
          value={`${summary.totalPrecipitation.toFixed(1)} mm`}
        />
        <SummaryItem
          icon={AlertTriangle}
          label="Viento"
          value={summary.hasDangerousWinds ? 'ALERTA' : 'NORMAL'}
          color={summary.hasDangerousWinds ? 'text-red-600' : 'text-green-600'}
        />
        <SummaryItem
          icon={Navigation}
          label="Viento Pred."
          value={`${summary.windArrow} ${summary.predominantWind}`}
          subtext={summary.predominantWindType?.type}
          color={summary.predominantWindType?.color}
        />
      </div>

      {/* TABLA HORARIA */}
      <h4 className="text-gray-800 font-semibold mb-3 text-lg">
        Pronóstico horario
      </h4>

      <WeatherHourlyGrid hourly={day.hours} />

      {/* HORAS CRÍTICAS */}
      <CriticalHours hours={day.hours} />
    </div>
  );
};

/* ===========================
   COMPONENTES AUX
=========================== */

const SummaryItem = ({ icon: Icon, label, value, subtext, color = 'text-gray-800' }) => (
  <div className="text-center p-3 rounded-lg bg-white/50">
    <Icon className="w-5 h-5 text-gray-700 mx-auto mb-2" />
    <p className={`text-lg font-bold ${color}`}>{value}</p>
    <p className="text-gray-600 text-sm">{label}</p>
    {subtext && <p className={`text-xs mt-1 ${color}`}>{subtext}</p>}
  </div>
);

const CriticalHours = ({ hours }) => {
  const critical = hours.filter(h =>
    h.isDangerous ||
    h.precipitation > 2 ||
    (getWindType(h.windDirection).type === 'ZONDA' && h.windGusts > 45)
  );

  if (critical.length === 0) {
    return (
      <div className="mt-6 p-4 text-center bg-green-500/20 rounded-xl">
        <p className="text-green-700 font-medium">
          No se esperan condiciones críticas
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h4 className="font-semibold mb-3 text-gray-800">
        Horarios importantes
      </h4>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {critical.map((h, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border bg-blue-500/20 border-blue-300"
          >
            <p className="font-bold text-sm">
              {h.hour}:00 hs – {h.windGusts} km/h
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Dirección: {h.windInfo.direction} {h.windInfo.arrow}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
