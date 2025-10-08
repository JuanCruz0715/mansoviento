import { useState } from 'react';
import { Calendar, AlertTriangle, Wind, Thermometer, CloudRain, Navigation } from 'lucide-react';
import { WeatherChart } from './WeatherChart';
import { getDaySummary, getWindType } from '../utils/windUtils';

export const WeatherForecast = ({ hourlyForecast }) => {
  const [selectedDay, setSelectedDay] = useState(0);

  if (!hourlyForecast) return null;

  return (
    <div className="glass-effect rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 border border-white/30 w-full">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Pronóstico {hourlyForecast.length} Días
        </h2>
      </div>

      <DayTabs days={hourlyForecast} selectedDay={selectedDay} onSelectDay={setSelectedDay} />
      <DayDetails day={hourlyForecast[selectedDay]} />
    </div>
  );
};

const DayTabs = ({ days, selectedDay, onSelectDay }) => {
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}`;
  };

  const getDayName = (dateString, index) => {
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, month - 1, day);
    
    const dayName = date.toLocaleDateString('es-AR', { weekday: 'long' });
    
    if (index === 0) return 'HOY';
    
    const capitalized = dayName.charAt(0).toUpperCase() + dayName.slice(1);
    return capitalized.substring(0, 4);
  };

  return (
    <div className="w-full mb-6">
      <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-4 scrollbar-hide w-full">
        {days.map((day, index) => {
          const summary = getDaySummary(day);
          const dayName = getDayName(day.date, index);
          const formattedDate = formatDate(day.date);
          
          return (
            <button
              key={day.date}
              onClick={() => onSelectDay(index)}
              className={`flex-1 min-w-0 p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 ${
                selectedDay === index
                  ? 'bg-yellow-500/30 border-yellow-400 shadow-lg scale-105'
                  : 'bg-white/50 border-white/40 hover:bg-white/70 hover:shadow-md'
              }`}
              style={{ minWidth: '120px' }} // Fuerza un ancho mínimo
            >
              <div className="text-center space-y-2 w-full">
                {/* Nombre del día */}
                <p className={`font-bold text-sm sm:text-base ${
                  selectedDay === index ? 'text-yellow-700' : 'text-gray-800'
                }`}>
                  {dayName}
                </p>
                
                {/* Fecha */}
                <p className="text-gray-600 text-sm">
                  {formattedDate}
                </p>
                
                {/* Temperaturas */}
                <div className="flex justify-center items-baseline gap-2">
                  <span className="text-gray-800 font-bold text-lg">{summary.tempMax}°</span>
                  <span className="text-blue-600 text-base">{summary.tempMin}°</span>
                </div>
                
                {/* Íconos de alerta */}
                <div className="flex justify-center gap-1">
                  {summary.hasDangerousWinds && (
                    <AlertTriangle className="w-4 h-4 text-red-500" title="Viento peligroso" />
                  )}
                  {summary.hasRain && (
                    <CloudRain className="w-4 h-4 text-blue-500" title="Lluvia" />
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const DayDetails = ({ day }) => {
  if (!day) return null;
  const summary = getDaySummary(day);

  return (
    <div className="bg-white/60 rounded-xl p-4 sm:p-6 border border-white/40 w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 mb-6 w-full">
        <SummaryItem 
          icon={Thermometer} 
          label="Temp Máx/Mín" 
          value={`${summary.tempMax}° / ${summary.tempMin}°`} 
        />
       <SummaryItem 
  icon={Wind} 
  label="Rachas Máx km/h" 
  value={summary.maxWindGusts} 
/>
        <SummaryItem 
          icon={CloudRain} 
          label="Lluvia mm" 
          value={summary.totalPrecipitation.toFixed(1)} 
        />
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

      <div className="mb-6 w-full">
        <WeatherChart data={day.hours} />
      </div>

      <CriticalHours hours={day.hours} />
    </div>
  );
};

const SummaryItem = ({ icon: Icon, label, value, subtext, color = 'text-gray-800' }) => (
  <div className="text-center p-3 rounded-lg bg-white/50 w-full">
    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 mx-auto mb-2" />
    <p className={`text-base sm:text-lg font-bold ${color} mb-1`}>{value}</p>
    <p className="text-gray-600 text-sm font-medium">{label}</p>
    {subtext && <p className={`text-xs ${color} mt-1`}>{subtext}</p>}
  </div>
);

const CriticalHours = ({ hours }) => {
  // Encontrar la hora con la racha máxima de viento Sur
  const surMaxGust = Math.max(...hours.map(h => {
    const windType = getWindType(h.windDirection);
    return (windType.type === 'SUR' || h.windInfo.direction === 'S') ? h.windGusts : 0;
  }));

  const surCriticalHour = hours.find(h => {
    const windType = getWindType(h.windDirection);
    return (windType.type === 'SUR' || h.windInfo.direction === 'S') && h.windGusts === surMaxGust;
  });

  const criticalHours = hours.filter(hour => 
    hour.isDangerous || 
    hour.precipitation > 2 || 
    getWindType(hour.windDirection).type === 'ZONDA'
  );

  // Agregar la hora crítica del viento Sur si existe
  if (surCriticalHour && surMaxGust > 40) { // Solo mostrar si es significativo
    criticalHours.push({
      ...surCriticalHour,
      isSurMax: true // Nueva propiedad para identificar
    });
  }

  return (
    <div className="mt-4 sm:mt-6">
      <h4 className="text-gray-800 font-semibold mb-2 sm:mb-3 text-base sm:text-lg">
        Horas importantes:
      </h4>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3">
        {criticalHours.map((hour, i) => {
          const windType = getWindType(hour.windDirection);
          
          return (
            <div 
              key={i} 
              className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 ${
                hour.isDangerous 
                  ? 'bg-red-500/20 border-red-300' 
                  : hour.isSurMax
                  ? 'bg-purple-500/20 border-purple-300'
                  : windType.type === 'ZONDA'
                  ? 'bg-orange-500/20 border-orange-300'
                  : 'bg-blue-500/20 border-blue-300'
              }`}
            >
              <p className="text-gray-800 font-bold text-xs sm:text-sm">
                {hour.hour}:00 hs -{' '}
                {hour.isDangerous 
                  ? `VIENTO FUERTE: ${hour.windGusts} km/h`
                  : hour.isSurMax
                  ? `SUR MÁXIMO: ${hour.windGusts} km/h ⬇️`
                  : windType.type === 'ZONDA'
                  ? `ZONDA: ${hour.windGusts} km/h 🌪️`
                  : `Lluvia: ${hour.precipitation} mm`
                }
              </p>
              <p className="text-gray-600 text-xs mt-1 sm:mt-2">
                Dirección: {hour.windInfo.direction} {hour.windInfo.arrow} • {windType.description}
                {hour.isSurMax && " • Racha máxima del día"}
              </p>
            </div>
          );
        })}
        {criticalHours.length === 0 && (
          <div className="p-3 sm:p-4 text-center bg-green-500/20 rounded-lg sm:rounded-xl border border-green-300">
            <p className="text-green-700 font-medium text-sm sm:text-base">
              No se esperan condiciones críticas
            </p>
          </div>
        )}
      </div>
    </div>
  );
};