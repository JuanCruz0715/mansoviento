import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Label } from 'recharts';
import { getWindType } from '../utils/windUtils';
import { Thermometer } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const dataItem = payload[0]?.payload;
    const windType = dataItem.WindType || getWindType(dataItem.windDirection);
    
    return (
      <div className="bg-gray-900/90 border border-gray-700 rounded-lg p-3 backdrop-blur-sm min-w-48">
        <p className="text-white font-semibold mb-2">{label}</p>
        
        {/* TEMPERATURA EN NARANJA */}
        {dataItem.Temperatura !== undefined && (
          <div className="mb-3 p-2 bg-orange-500/10 border border-orange-500/30 rounded">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-orange-400" />
              <span className="text-orange-400 font-bold text-lg">
                {dataItem.Temperatura}°C
              </span>
            </div>
          </div>
        )}

        <div className="mb-2">
          <div className="grid grid-cols-2 gap-1 text-sm">
            <div><span className="text-gray-300">Viento:</span><span className="text-white ml-1 font-semibold">{dataItem.Viento} km/h</span></div>
            <div><span className="text-gray-300">Dirección:</span><span className="text-white ml-1 font-semibold">{dataItem.windInfo?.direction}</span><span className="ml-1">{dataItem.WindArrow}</span></div>
          </div>
          
          {windType && (
            <div className={`mt-1 p-1 rounded text-xs font-semibold ${windType.color} bg-white/10`}>
              {windType.emoji} {windType.type} - {windType.description}
            </div>
          )}
        </div>

        <div className="border-t border-gray-600 my-2"></div>

        {/* Información de Lluvia */}
        <div className="space-y-1">
          <p style={{ color: '#06b6d4' }} className="text-sm">
            Lluvia: <strong>{dataItem.Lluvia} mm</strong>
          </p>
          {dataItem.ProbLluvia !== undefined && (
            <p style={{ color: '#8b5cf6' }} className="text-sm">
              Prob. Lluvia: <strong>{dataItem.ProbLluvia}%</strong>
            </p>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export const WeatherChart = ({ data }) => {
  const chartData = data.map(hour => ({
    hora: `${hour.hour}h`,
    Temperatura: hour.temperature, // ← AGREGADO: Temperatura
    Viento: hour.windGusts,
    Lluvia: hour.precipitation,
    ProbLluvia: hour.precipitationProbability,
    windInfo: hour.windInfo,
    WindType: getWindType(hour.windDirection),
    WindArrow: hour.windInfo.arrow,
    hasRain: hour.precipitation > 0.1 // Flag para saber si hay lluvia
  }));

  // Calcular temperatura promedio para la línea de referencia
  const temps = chartData.map(d => d.Temperatura || 0).filter(t => t > -100);
  const avgTemp = temps.length > 0 ? temps.reduce((a, b) => a + b, 0) / temps.length : 20;

  return (
    <div className="h-48 sm:h-56 md:h-64 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
          <XAxis 
            dataKey="hora" 
            stroke="#4B5563" 
            fontSize={10} 
            tick={{ fill: '#4B5563' }} 
            interval="preserveStartEnd" 
            minTickGap={10}
          />
          
          {/* Eje Y para Temperatura (izquierda) */}
          <YAxis 
            yAxisId="temp"
            stroke="#f97316" 
            fontSize={10} 
            tick={{ fill: '#f97316' }} 
            width={35}
            label={{ 
              value: '°C', 
              angle: -90, 
              position: 'insideLeft',
              offset: -10,
              fill: '#f97316',
              fontSize: 10
            }}
          />
          
          {/* Eje Y para Viento/Lluvia (derecha) */}
          <YAxis 
            yAxisId="wind"
            orientation="right" 
            stroke="#4B5563" 
            fontSize={10} 
            tick={{ fill: '#4B5563' }} 
            width={35}
          />
          
          <Tooltip 
            content={<CustomTooltip />} 
            position={{ x: 0, y: 0 }}
            wrapperStyle={{ zIndex: 1000 }}
          />
          
          <Legend 
            wrapperStyle={{ 
              color: '#4B5563', 
              fontSize: '10px', 
              paddingTop: '10px',
              display: 'flex',
              justifyContent: 'center',
              gap: '20px'
            }} 
            iconSize={8}
          />
          
          {/* LÍNEA DE TEMPERATURA (NARANJA) */}
          <Line 
            yAxisId="temp"
            type="monotone" 
            dataKey="Temperatura" 
            stroke="#f97316" 
            strokeWidth={3}
            dot={{ 
              fill: '#f97316', 
              strokeWidth: 2, 
              r: 3,
              stroke: '#fff',
              strokeWidth: 1
            }} 
            activeDot={{ 
              r: 5, 
              fill: '#ea580c',
              stroke: '#fff',
              strokeWidth: 1
            }} 
            name="Temperatura (°C)"
          />
          
          {/* Línea de referencia para temperatura promedio */}
          <ReferenceLine 
            yAxisId="temp"
            y={avgTemp} 
            stroke="#f97316" 
            strokeWidth={1} 
            strokeDasharray="3 3"
            label={{
              value: `Avg: ${avgTemp.toFixed(1)}°C`,
              position: 'right',
              fill: '#f97316',
              fontSize: 9,
              opacity: 0.7
            }}
          />
          
          {/* Viento - línea roja */}
          <Line 
            yAxisId="wind"
            type="monotone" 
            dataKey="Viento" 
            stroke="#ef4444" 
            strokeWidth={2} 
            dot={{ fill: '#ef4444', strokeWidth: 2, r: 2 }} 
            activeDot={{ r: 4, fill: '#dc2626' }} 
            name="Viento (km/h)" 
          />
          
          {/* Líneas verticales azules SOLO cuando hay lluvia > 0.1mm */}
          {chartData.map((entry, index) => (
            entry.hasRain && (
              <ReferenceLine
                key={index}
                x={entry.hora}
                stroke="#06b6d4"
                strokeWidth={3}
                strokeDasharray="0"
                yAxisId="wind"
                label={{
                  value: `${entry.Lluvia}mm`,
                  position: 'top',
                  fill: '#06b6d4',
                  fontSize: 9
                }}
              />
            )
          ))}
        </LineChart>
      </ResponsiveContainer>
      
      {/* TEXTO DE TEMPERATURA ABAJO DEL GRÁFICO (EN NARANJA) */}
      
    </div>
  );
};