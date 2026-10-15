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
    const props = { className: 'w-4 h-4', strokeWidth: 1.5 };
    switch (type) {
      case 'ZONDA': return <Wind {...props} />;
      case 'SUR': return <Wind {...props} />;
      case 'LLUVIA': return <CloudRain {...props} />;
      case 'VIENTO_PELIGROSO': return <AlertTriangle {...props} />;
      default: return <AlertTriangle {...props} />;
    }
  };

  const getAlertStyle = (type, severity) => {
    const styles = {
      high: {
        ZONDA: 'bg-orange-500/10 border-orange-400/40 text-orange-200',
        SUR: 'bg-blue-500/10 border-blue-400/40 text-blue-200',
        LLUVIA: 'bg-cyan-500/10 border-cyan-400/40 text-cyan-200',
        VIENTO_PELIGROSO: 'bg-red-500/10 border-red-400/40 text-red-200',
      },
      default: {
        ZONDA: 'bg-orange-500/5 border-orange-400/30 text-orange-300',
        SUR: 'bg-blue-500/5 border-blue-400/30 text-blue-300',
        LLUVIA: 'bg-cyan-500/5 border-cyan-400/30 text-cyan-300',
        VIENTO_PELIGROSO: 'bg-red-500/5 border-red-400/30 text-red-300',
      },
    };
    const palette = severity === 'high' ? styles.high : styles.default;
    return palette[type] || palette.LLUVIA;
  };

  const visibleAlerts = alerts.filter(shouldShowAlert);

  if (visibleAlerts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 mb-4">

      {/* Header */}
      <div className="flex items-center gap-2 px-1">
        <AlertTriangle className="w-4 h-4 text-amber-400" strokeWidth={1.5} />
        <h3 className="text-sm font-medium text-white/80 uppercase tracking-wider">
          Alertas futuras · 2 días
        </h3>
      </div>

      {/* Alertas */}
      {visibleAlerts.map((alert, index) => (
        <div
          key={index}
          className={`rounded-2xl border backdrop-blur-sm p-4 ${getAlertStyle(alert.type, alert.severity)}`}
        >
          <div className="flex items-start justify-between gap-3">

            <div className="flex items-start gap-3 flex-1">
              <div className="mt-0.5">
                {getAlertIcon(alert.type)}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm leading-snug">
                  {alert.message}
                </p>
                <p className="text-xs opacity-70 mt-1">
                  Para el {new Date(alert.date).toLocaleDateString('es-AR')}
                </p>
              </div>
            </div>

            <button
              onClick={() => dismissAlert(alert)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
              title="Descartar alerta"
              aria-label="Descartar alerta"
            >
              <X className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>

          </div>
        </div>
      ))}
    </div>
  );
};