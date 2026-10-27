import { useState } from 'react';
import { AlertTriangle, Wind, CloudRain, X } from 'lucide-react';

export const WeatherAlerts = ({ alerts }) => {
  const [dismissedAlerts, setDismissedAlerts] = useState([]);

  const shouldShowAlert = (alert) => {
    const today = new Date().toDateString();
    const alertKey = `${alert.type}-${alert.date}-${today}`;
    return !dismissedAlerts.includes(alertKey);
  };

  const dismissAlert = (alert) => {
    const today = new Date().toDateString();
    const alertKey = `${alert.type}-${alert.date}-${today}`;
    setDismissedAlerts(prev => [...prev, alertKey]);
  };

  const getAlertIcon = (type) => {
    const props = { className: 'w-4 h-4 text-amber-500', strokeWidth: 1.5 };
    switch (type) {
      case 'ZONDA': return <Wind {...props} />;
      case 'SUR': return <Wind {...props} />;
      case 'LLUVIA': return <CloudRain {...props} />;
      case 'VIENTO_PELIGROSO': return <AlertTriangle {...props} />;
      default: return <AlertTriangle {...props} />;
    }
  };

  const getAlertStyle = (severity) => {
    return severity === 'high' 
      ? 'bg-red-500/10 border-red-500/30 text-red-200' 
      : 'bg-amber-500/10 border-amber-500/30 text-amber-200';
  };

  const visibleAlerts = alerts.filter(shouldShowAlert);

  if (visibleAlerts.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl bg-[#0f0f11] border border-white/5 p-4 shadow-xl space-y-3">
      <div className="flex items-center gap-2 pb-2 border-b border-white/5">
        <AlertTriangle className="w-4 h-4 text-amber-500" strokeWidth={1.5} />
        <h3 className="text-xs font-bold text-white/90 uppercase tracking-widest">
          Alertas activas
        </h3>
      </div>

      {visibleAlerts.map((alert, index) => (
        <div key={index} className={`rounded-lg border p-3 ${getAlertStyle(alert.severity)}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2 flex-1">
              <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
              <div className="flex-1">
                <p className="font-semibold text-xs leading-snug uppercase tracking-wide">
                  {alert.message}
                </p>
                <p className="text-[10px] opacity-70 mt-1 uppercase tracking-wider">
                  {new Date(alert.date).toLocaleDateString('es-AR')}
                </p>
              </div>
            </div>
            <button
              onClick={() => dismissAlert(alert)}
              className="p-1 rounded hover:bg-white/10 transition-colors flex-shrink-0"
            >
              <X className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};