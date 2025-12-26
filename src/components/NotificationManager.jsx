import { useState, useEffect, useCallback } from 'react';
import { Bell, BellOff, AlertTriangle, CloudRain, Wind, RefreshCw } from 'lucide-react';

// Verificar soporte de notificaciones
const checkNotificationSupport = () => {
  return 'serviceWorker' in navigator && 'Notification' in window;
};

// Registrar Service Worker
const registerServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) return null;
  
  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('✅ Service Worker registrado:', registration);
    
    // Esperar a que el Service Worker esté activo
    if (registration.active) {
      return registration;
    }
    
    if (registration.installing) {
      await new Promise((resolve) => {
        registration.installing.addEventListener('statechange', (e) => {
          if (e.target.state === 'activated') {
            resolve(registration);
          }
        });
      });
    }
    
    return registration;
  } catch (error) {
    console.error('❌ Error registrando Service Worker:', error);
    return null;
  }
};

// Solicitar permisos
const requestNotificationPermission = async () => {
  if (!('Notification' in window)) return 'unsupported';
  
  try {
    const permission = await Notification.requestPermission();
    console.log('🔐 Permiso de notificaciones:', permission);
    return permission;
  } catch (error) {
    console.error('❌ Error solicitando permiso:', error);
    return 'denied';
  }
};

// Enviar notificación a través del Service Worker (CORREGIDO)
const sendNotification = async (title, body, type = 'DEFAULT', requireInteraction = true) => {
  if (!('serviceWorker' in navigator)) {
    console.warn('⚠️ Service Worker no disponible, usando notificación simple');
    
    // Fallback a notificación simple
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body: body,
        icon: '/icon-192.png',
        requireInteraction: requireInteraction,
        // NO incluir 'actions' aquí - eso causa el error
      });
      return true;
    }
    return false;
  }
  
  const registration = await navigator.serviceWorker.ready;
  
  try {
    // Enviar mensaje al Service Worker
    registration.active.postMessage({
      type: 'SHOW_NOTIFICATION',
      payload: {
        title,
        body,
        type,
        requireInteraction
      }
    });
    
    console.log('📤 Notificación enviada al Service Worker');
    return true;
  } catch (error) {
    console.error('❌ Error enviando notificación:', error);
    
    // Fallback si el Service Worker falla
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body: body,
        icon: '/icon-192.png',
        requireInteraction: requireInteraction
      });
      return true;
    }
    
    return false;
  }
};

// Componente principal
export const NotificationManager = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState('default');
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [swStatus, setSwStatus] = useState('checking');

  // Inicializar notificaciones
  const initializeNotifications = useCallback(async () => {
    console.log('🎯 Inicializando sistema de notificaciones...');
    
    const supported = checkNotificationSupport();
    setIsSupported(supported);
    
    if (!supported) {
      setSwStatus('unsupported');
      return;
    }

    try {
      // Verificar estado actual
      const currentPermission = Notification.permission;
      setPermission(currentPermission);
      
      // Verificar estado guardado
      const savedState = localStorage.getItem('notificationsEnabled');
      const wasEnabled = savedState === 'true';
      
      console.log('📊 Estado inicial:', { permission: currentPermission, savedState: wasEnabled });

      // Registrar Service Worker
      setSwStatus('registering');
      const registration = await registerServiceWorker();
      
      if (registration) {
        setSwStatus('active');
        
        // Si ya tenía permisos y estaba habilitado, activar
        if (currentPermission === 'granted' && wasEnabled) {
          setIsEnabled(true);
          console.log('✅ Notificaciones reactivadas automáticamente');
          
          // Enviar notificación de bienvenida
          setTimeout(() => {
            sendNotification(
              '🔔 Alertas Reactivadas',
              'Las notificaciones climáticas están activas',
              'WELCOME',
              false
            );
          }, 2000);
        }
      } else {
        setSwStatus('error');
      }
    } catch (error) {
      console.error('❌ Error en inicialización:', error);
      setSwStatus('error');
    }
  }, []);

  // Efecto de inicialización
  useEffect(() => {
    initializeNotifications();
  }, [initializeNotifications]);

  // Activar notificaciones
  const enableNotifications = async () => {
    setIsLoading(true);
    
    try {
      console.log('🔄 Activando notificaciones...');
      
      // Solicitar permisos
      const newPermission = await requestNotificationPermission();
      setPermission(newPermission);
      
      if (newPermission === 'granted') {
        // Guardar preferencia
        localStorage.setItem('notificationsEnabled', 'true');
        setIsEnabled(true);
        
        console.log('✅ Notificaciones activadas');
        
        // Notificación de bienvenida
        setTimeout(() => {
          sendNotification(
            '✅ Notificaciones Activadas',
            'Recibirás alertas de lluvia, Zonda y viento Sur',
            'WELCOME',
            true
          );
        }, 1000);
      } else {
        console.warn('⚠️ Permiso denegado por el usuario');
      }
    } catch (error) {
      console.error('❌ Error activando notificaciones:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Desactivar notificaciones
  const disableNotifications = async () => {
    setIsLoading(true);
    
    try {
      console.log('🔄 Desactivando notificaciones...');
      
      localStorage.setItem('notificationsEnabled', 'false');
      setIsEnabled(false);
      
      console.log('✅ Notificaciones desactivadas');
      
      // Notificación de despedida
      setTimeout(() => {
        sendNotification(
          '🔕 Notificaciones Desactivadas',
          'Ya no recibirás alertas climáticas',
          'DEFAULT',
          false
        );
      }, 500);
    } catch (error) {
      console.error('❌ Error desactivando notificaciones:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Test de notificaciones
  const testNotification = async () => {
    if (!isEnabled || permission !== 'granted') return;
    
    await sendNotification(
      '🧪 Test de Notificaciones',
      '¡Las notificaciones están funcionando correctamente!',
      'TEST',
      true
    );
  };

  // Función para enviar alertas climáticas (exportada)
  const sendWeatherAlert = useCallback(async (alert) => {
    if (!isEnabled || permission !== 'granted') return;
    
    const alertTypes = {
      ZONDA: { icon: '🌪️', title: 'Alerta de VIENTO ZONDA' },
      SUR: { icon: '⬇️', title: 'Alerta de VIENTO SUR' },
      LLUVIA: { icon: '🌧️', title: 'Alerta de LLUVIA' },
      VIENTO_PELIGROSO: { icon: '⚠️', title: 'Alerta de VIENTO PELIGROSO' }
    };
    
    const config = alertTypes[alert.type] || { icon: '🌤️', title: 'Alerta Climática' };
    
    await sendNotification(
      `${config.icon} ${config.title}`,
      alert.message,
      alert.type,
      true
    );
  }, [isEnabled, permission]);

  // Estados de carga/error
  if (!isSupported) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 rounded-xl p-4 text-sm">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <span className="font-semibold text-yellow-800">Navegador no compatible</span>
        </div>
        <p className="text-yellow-700">
          Tu navegador no soporta notificaciones. Probá con Chrome, Firefox o Edge.
        </p>
      </div>
    );
  }

  if (swStatus === 'error') {
    return (
      <div className="bg-red-100 border border-red-400 rounded-xl p-4 text-sm">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <span className="font-semibold text-red-800">Error del sistema</span>
        </div>
        <p className="text-red-700 mb-3">
          Hubo un problema con el servicio de notificaciones.
        </p>
        <button
          onClick={initializeNotifications}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/40">
      <div className="flex items-center gap-3 mb-3">
        {isEnabled ? (
          <Bell className="w-6 h-6 text-green-600" />
        ) : (
          <BellOff className="w-6 h-6 text-gray-600" />
        )}
        <h3 className="font-semibold text-gray-800 text-lg">Alertas Climáticas</h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        Recibí notificaciones instantáneas de:
      </p>

      <div className="grid grid-cols-1 gap-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Wind className="w-4 h-4 text-orange-500" />
          <span>Viento Zonda &gt; 45 km/h</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <span>Viento peligroso &gt; 70 km/h</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CloudRain className="w-4 h-4 text-blue-500" />
          <span>Lluvia &gt; 0.5 mm</span>
        </div>
      </div>

      {swStatus !== 'active' && (
        <div className="bg-blue-100 border border-blue-400 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 text-blue-800 text-sm">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>
              {swStatus === 'registering' && 'Configurando servicio...'}
              {swStatus === 'checking' && 'Verificando compatibilidad...'}
            </span>
          </div>
        </div>
      )}

      {isEnabled ? (
        <div className="space-y-3">
          <div className="text-center">
            <p className="text-green-600 font-medium">✅ Notificaciones activadas</p>
            <p className="text-xs text-gray-500 mt-1">
              Estado: {swStatus === 'active' ? 'Servicio activo' : 'Configurando...'}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={testNotification}
              disabled={isLoading || swStatus !== 'active'}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-2 px-3 rounded-lg transition-colors font-medium text-sm"
            >
              🧪 Test
            </button>
            
            <button
              onClick={disableNotifications}
              disabled={isLoading}
              className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white py-2 px-3 rounded-lg transition-colors font-medium text-sm"
            >
              {isLoading ? '...' : '🔕 Desactivar'}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={enableNotifications}
          disabled={isLoading || permission === 'denied' || swStatus !== 'active'}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors font-medium"
        >
          {isLoading ? 'Activando...' : '🔔 Activar Notificaciones (Modo Prueba Solo Para PCs)'}
        </button>
      )}     
      {permission === 'denied' && (
        <p className="text-red-500 text-xs mt-2 text-center">
          ❌ Los permisos fueron denegados. Permití las notificaciones en la configuración de tu navegador.
        </p>
      )}
    </div>
  );
};

