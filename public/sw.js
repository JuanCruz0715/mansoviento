// public/sw.js - Solo la parte de showNotification actualizada
function showNotification(data) {
  const icon = ALERT_ICONS[data.type] || ALERT_ICONS.DEFAULT;
  const title = data.title || 'Alerta Climática';
  const body = data.body || 'Nueva alerta meteorológica';
  
  const options = {
    body: body,
    icon: APP_ICON,
    badge: BADGE_ICON,
    vibrate: [200, 100, 200],
    data: { 
      url: data.url || '/',
      alert: data.alert,
      timestamp: Date.now()
    },
    tag: `alert-${data.type}-${Date.now()}`,
    requireInteraction: data.requireInteraction || false,
    // Acciones SÍ aquí porque es del Service Worker
    actions: [
      {
        action: 'view',
        title: '🔍 Ver Detalles'
      },
      {
        action: 'close',
        title: '❌ Cerrar'
      }
    ]
  };
  
  return self.registration.showNotification(`${icon} ${title}`, options);
}