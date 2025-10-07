import { useState } from 'react';
import { Calendar, AlertTriangle, Wind, Thermometer, CloudRain, Navigation } from 'lucide-react';
import { WeatherChart } from './WeatherChart';
import { getDaySummary, getWindType } from '../utils/windUtils';

export const WeatherForecast = ({ hourlyForecast }) => {
  const [selectedDay, setSelectedDay] = useState(0);

  if (!hourlyForecast) return null;

  return (
    <div className="glass-effect rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/30">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Pronóstico 7 Días</h2>
      </div>

      <DayTabs days={hourlyForecast} selectedDay={selectedDay} onSelectDay={setSelectedDay} />
      <DayDetails day={hourlyForecast[selectedDay]} />
    </div>
  );
};

const DayTabs = ({ days, selectedDay, onSelectDay }) => (
  <div className="flex sm:grid sm:grid-cols-7 gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2 sm:pb-0">
    {days.map((day, index) => {
      const summary = getDaySummary(day);
      return (
        <button
          key={day.date}
          onClick={() => onSelectDay(index)}
          className={`flex-shrink-0 w-16 sm:w-auto p-2 rounded-xl border-2 transition-all ${
            selectedDay === index
              ? 'bg-yellow-500/30 border-yellow-400'
              : 'bg-white/50 border-white/30 hover:bg-white/70'
          }`}
        >
          <div className="text-center">
            <p className={`font-semibold text-xs sm:text-sm ${
              selectedDay === index ? 'text-yellow-700' : 'text-gray-800'
            }`}>
              {index === 0 ? 'HOY' : 
               index === 1 ? 'MAÑ' :
               new Date(day.date).toLocaleDateString('es-AR', { weekday: 'short' })}
            </p>
            <p className="text-gray-600 text-xs">
              {new Date(day.date).getDate()}/{new Date(day.date).getMonth() + 1}
            </p>
            <div className="flex justify-center gap-1 mt-1 text-xs">
              <span className="text-gray-800">{summary.tempMax}°</span>
              <span className="text-blue-600">{summary.tempMin}°</span>
            </div>
            {summary.hasDangerousWinds && <AlertTriangle className="w-3 h-3 text-red-500 mx-auto mt-1" />}
            {summary.hasRain && <CloudRain className="w-3 h-3 text-blue-500 mx-auto mt-1" />}
          </div>
        </button>
      );
    })}
  </div>
);

const DayDetails = ({ day }) => {
  if (!day) return null;
  const summary = getDaySummary(day);

  return (
    <div className="bg-white/60 rounded-xl p-3 sm:p-4 border border-white/40">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 mb-4">
        <SummaryItem icon={Thermometer} label="Temp Máx/Mín" value={`${summary.tempMax}° / ${summary.tempMin}°`} />
        <SummaryItem icon={Wind} label="Rachas km/h" value={summary.maxWindGusts} />
        <SummaryItem icon={CloudRain} label="Lluvia mm" value={summary.totalPrecipitation.toFixed(1)} />
        <SummaryItem 
          icon={AlertTriangle} 
          label="Viento" 
          value={summary.hasDangerousWinds ? 'ALERTA' : 'NORMAL'} 
          color={summary.hasDangerousWinds ? 'text-red-600' : 'text-green-600'}
        />
        <SummaryItem 
          icon={Navigation} 
          label="Viento Pred" 
          value={`${summary.windArrow} ${summary.predominantWind}`}
          subtext={summary.predominantWindType?.type}
          color={summary.predominantWindType?.color}
        />
      </div>

      <WeatherChart data={day.hours} />
      <CriticalHours hours={day.hours} />
    </div>
  );
};

const SummaryItem = ({ icon: Icon, label, value, subtext, color = 'text-gray-800' }) => (
  <div className="text-center">
    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 mx-auto mb-1" />
    <p className={`text-base sm:text-lg font-bold ${color}`}>{value}</p>
    <p className="text-gray-600 text-xs">{label}</p>
    {subtext && <p className={`text-xs ${color}`}>{subtext}</p>}
  </div>
);

const CriticalHours = ({ hours }) => {
  const criticalHours = hours.filter(hour => hour.isDangerous || hour.precipitation > 2 || getWindType(hour.windDirection).type === 'ZONDA');

  return (
    <div className="mt-3 sm:mt-4">
      <h4 className="text-gray-800 font-semibold mb-2 text-sm">Horas importantes:</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs sm:text-sm">
        {criticalHours.map((hour, i) => {
          const windType = getWindType(hour.windDirection);
          return (
            <div key={i} className={`p-2 rounded-lg ${
              hour.isDangerous ? 'bg-red-500/20' : 
              windType.type === 'ZONDA' ? 'bg-orange-500/20' :
              'bg-blue-500/20'
            }`}>
              <p className="text-gray-800 font-semibold">
                {hour.hour}:00 hs -{' '}
                {hour.isDangerous 
                  ? `VIENTO FUERTE: ${hour.windGusts} km/h`
                  : windType.type === 'ZONDA'
                  ? `ZONDA: ${hour.windGusts} km/h ${windType.emoji}`
                  : `Lluvia: ${hour.precipitation} mm`
                }
              </p>
              <p className="text-gray-600 text-xs mt-1">
                Dirección: {hour.windInfo.direction} {hour.windInfo.arrow} • {windType.description}
              </p>
            </div>
          );
        })}
        {criticalHours.length === 0 && (
          <p className="text-gray-600 text-sm p-2">No se esperan condiciones críticas</p>
        )}
      </div>
    </div>
  );
};