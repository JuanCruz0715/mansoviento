import { useState, useEffect } from 'react';
import { AlertTriangle, Wind, CloudRain, Bell, X } from 'lucide-react';

export const WeatherAlerts = ({ alerts, onNotificationSend }) => {
  const [dismissedAlerts, setDismissedAlerts] = useState([]);

  // Verificar si ya mostramos estas alertas hoy
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

  const sendNotification = async (alert) => {
  await sendWeatherAlert(alert);
  dismissAlert(alert);
  
  if (onNotificationSend) {
    onNotificationSend(alert);
  }
};

  const getAlertIcon = (type) => {
    switch (type) {
      case 'ZONDA': return <Wind className="w-5 h-5 text-orange-500" />;
      case 'SUR': return <Wind className="w-5 h-5 text-blue-500" />;
      case 'LLUVIA': return <CloudRain className="w-5 h-5 text-cyan-500" />;
      case 'VIENTO_PELIGROSO': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default: return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getAlertColor = (type, severity) => {
    if (severity === 'high') {
      const colors = {
        ZONDA: 'bg-orange-100 border-orange-400 text-orange-800',
        SUR: 'bg-blue-100 border-blue-400 text-blue-800',
        LLUVIA: 'bg-cyan-100 border-cyan-400 text-cyan-800',
        VIENTO_PELIGROSO: 'bg-red-100 border-red-400 text-red-800'
      };
      return colors[type] || 'bg-yellow-100 border-yellow-400 text-yellow-800';
    } else {
      const colors = {
        ZONDA: 'bg-orange-50 border-orange-300 text-orange-700',
        SUR: 'bg-blue-50 border-blue-300 text-blue-700', 
        LLUVIA: 'bg-cyan-50 border-cyan-300 text-cyan-700',
        VIENTO_PELIGROSO: 'bg-red-50 border-red-300 text-red-700'
      };
      return colors[type] || 'bg-yellow-50 border-yellow-300 text-yellow-700';
    }
  };

  // Enviar notificaciones automáticamente para alertas graves
  useEffect(() => {
    alerts.forEach(alert => {
      if (shouldShowAlert(alert) && alert.severity === 'high') {
        // Enviar notificación automática para alertas graves
        sendNotification(alert);
      }
    });
  }, [alerts]);

  const visibleAlerts = alerts.filter(shouldShowAlert);

  if (visibleAlerts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 mb-4">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-yellow-500" />
        <h3 className="font-semibold text-gray-800">Alertas Futuras (2 días)</h3>
      </div>
      
      {visibleAlerts.map((alert, index) => (
        <div 
          key={index}
          className={`border rounded-xl p-3 ${getAlertColor(alert.type, alert.severity)}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 flex-1">
              {getAlertIcon(alert.type)}
              <div>
                <p className="font-semibold text-sm">{alert.message}</p>
                <p className="text-xs opacity-75">
                  Para el {new Date(alert.date).toLocaleDateString('es-AR')}
                </p>
              </div>
            </div>
            
            <div className="flex gap-1">
              <button
                onClick={() => sendNotification(alert)}
                className="p-1 hover:bg-white/30 rounded transition-colors"
                title="Enviar notificación"
              >
                <Bell className="w-4 h-4" />
              </button>
              <button
                onClick={() => dismissAlert(alert)}
                className="p-1 hover:bg-white/30 rounded transition-colors"
                title="Descartar alerta"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};