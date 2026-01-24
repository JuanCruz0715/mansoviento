export default function WeatherHourlyGrid({ hourly }) {
  if (!hourly || hourly.length === 0) {
    return <p className="text-center text-gray-500">Sin datos horarios</p>;
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-max">

        {/* FILA HORAS */}
        <div className="grid grid-flow-col auto-cols-[60px] gap-2 mb-2 text-xs font-semibold text-gray-600">
          <div className="w-24"></div>
          {hourly.map((h, i) => (
            <div key={i} className="text-center">
              {h.hour}h
            </div>
          ))}
        </div>

        {/* TEMPERATURA */}
        <Row label="Temp °C">
          {hourly.map((h, i) => (
            <Cell key={i} className="text-orange-600 font-semibold">
              {h.temperature}°
            </Cell>
          ))}
        </Row>

        {/* LLUVIA */}
        <Row label="Lluvia mm">
          {hourly.map((h, i) => (
            <Cell key={i} className={h.precipitation > 0 ? 'text-blue-600' : 'text-gray-400'}>
              {h.precipitation?.toFixed(1)}
            </Cell>
          ))}
        </Row>

        {/* VIENTO */}
        <Row label="Viento km/h">
          {hourly.map((h, i) => (
            <Cell key={i}>
              {h.windSpeed}
            </Cell>
          ))}
        </Row>

        {/* RACHAS */}
        <Row label="Rachas">
          {hourly.map((h, i) => (
            <Cell
              key={i}
              className={h.windGusts > 60 ? 'text-red-600 font-semibold' : ''}
            >
              {h.windGusts}
            </Cell>
          ))}
        </Row>

        {/* DIRECCIÓN */}
        <Row label="Direc">
          {hourly.map((h, i) => (
            <Cell key={i} className="text-lg">
              {h.windInfo?.arrow}
            </Cell>
          ))}
        </Row>

      </div>
    </div>
  );
}

/* ====== Helpers ====== */

const Row = ({ label, children }) => (
  <div className="grid grid-flow-col auto-cols-[60px] gap-2 items-center mb-2">
    <div className="w-24 text-xs font-semibold text-gray-600">
      {label}
    </div>
    {children}
  </div>
);

const Cell = ({ children, className = '' }) => (
  <div
    className={`h-9 flex items-center justify-center text-sm bg-white/70 rounded-lg ${className}`}
  >
    {children}
  </div>
);
