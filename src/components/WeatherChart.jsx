import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getWindType } from '../utils/windUtils';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const dataItem = payload[0]?.payload;
    const windType = dataItem.WindType || getWindType(dataItem.windDirection);
    
    return (
      <div className="bg-gray-900/90 border border-gray-700 rounded-lg p-3 backdrop-blur-sm min-w-48">
        <p className="text-white font-semibold mb-2">{label}</p>
        
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

        {payload.map((entry, index) => (
          entry.dataKey !== 'Viento' && (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.dataKey}: <strong>{entry.value}</strong>
              {entry.dataKey === 'Lluvia' ? ' mm' : '°C'}
            </p>
          )
        ))}
      </div>
    );
  }
  return null;
};

export const WeatherChart = ({ data }) => {
  const chartData = data.map(hour => ({
    hora: `${hour.hour}h`,
    Viento: hour.windGusts,
    Lluvia: hour.precipitation,
    Temperatura: hour.temperature,
    windInfo: hour.windInfo,
    WindType: getWindType(hour.windDirection),
    WindArrow: hour.windInfo.arrow
  }));

  return (
    <div className="h-48 sm:h-56 md:h-64 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
          <XAxis dataKey="hora" stroke="#4B5563" fontSize={10} tick={{ fill: '#4B5563' }} interval="preserveStartEnd" minTickGap={10} />
          <YAxis stroke="#4B5563" fontSize={10} tick={{ fill: '#4B5563' }} width={30} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ color: '#4B5563', fontSize: '10px', paddingTop: '10px' }} iconSize={8} />
          <Line type="monotone" dataKey="Viento" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', strokeWidth: 2, r: 2 }} activeDot={{ r: 4, fill: '#dc2626' }} name="Viento" />
          <Line type="monotone" dataKey="Lluvia" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4', strokeWidth: 2, r: 2 }} activeDot={{ r: 4, fill: '#0891b2' }} name="Lluvia" />
          <Line type="monotone" dataKey="Temperatura" stroke="#eab308" strokeWidth={2} dot={{ fill: '#eab308', strokeWidth: 2, r: 2 }} activeDot={{ r: 4, fill: '#ca8a04' }} name="Temp" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};