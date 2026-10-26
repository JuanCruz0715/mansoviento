import { MapContainer, TileLayer, Circle, Popup, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';
import { coloresNivel, nivelPuntoPorLluvia } from '../utils/riskUtils';
import { puntosCercanos } from '../utils/geoUtils';
import { useUserLocation } from '../hooks/useUserLocation';

// Fix para los iconos por defecto de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

/* ===========================
   Capa de radar (RainViewer)
=========================== */

function RainRadarLayer({ opacity = 0.6 }) {
  const [radarUrl, setRadarUrl] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadRadar() {
      try {
        const response = await fetch('https://api.rainviewer.com/public/weather-maps.json');
        if (!response.ok) throw new Error(`RainViewer respondió ${response.status}`);
        const data = await response.json();
        const frames = data.radar?.past || [];
        const latestFrame = frames[frames.length - 1];
        if (!latestFrame) throw new Error('No hay imágenes de radar');
        if (!cancelled) setRadarUrl(`${data.host}${latestFrame.path}`);
      } catch (error) {
        console.error('Error cargando radar:', error);
      }
    }

    loadRadar();
    return () => { cancelled = true; };
  }, []);

  if (!radarUrl) return null;

  return (
    <TileLayer
      url={`${radarUrl}/256/{z}/{x}/{y}/2/1_1.png`}
      opacity={opacity}
      zIndex={100}
      maxNativeZoom={7}
      maxZoom={19}
      tileSize={256}
    />
  );
}

/* ===========================
   Componente para animar el "vuelo" del mapa
=========================== */

function FlyToLocation({ location }) {
  const map = useMap();
  
  useEffect(() => {
    if (location) {
      // flyTo hace una animación suave hacia la ubicación
      map.flyTo([location.lat, location.lng], 13, { duration: 1.5 });
    }
  }, [location, map]);
  
  return null;
}

/* ===========================
   Estilos de popup
=========================== */

const popupStyles = {
  title: { fontSize: '14px', fontWeight: 600, color: '#0f172a', marginRight: '6px' },
  badge: (color) => ({
    display: 'inline-block',
    padding: '2px 8px',
    fontSize: '10px',
    borderRadius: '999px',
    background: color + '20',
    color,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  }),
  text: { margin: '8px 0 4px', fontSize: '12px', color: '#475569', lineHeight: 1.5 },
  label: { fontWeight: 600, color: '#1e293b' },
  button: {
    display: 'inline-block',
    marginTop: '8px',
    padding: '6px 12px',
    background: '#dc2626',
    color: 'white',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '12px',
    fontWeight: 600,
  },
};

/* ===========================
   Marcador de ubicación
=========================== */

function LocationMarker({ location, puntos }) {
  const dentroDe = puntosCercanos(location.lat, location.lng, puntos);

  return (
    <>
      <Marker position={[location.lat, location.lng]} icon={userIcon}>
        <Popup>
          <div style={{ minWidth: '200px' }}>
            <strong style={popupStyles.title}>📍 Tu ubicación</strong>

            {dentroDe.length > 0 ? (
              <div
                style={{
                  marginTop: '8px',
                  padding: '10px',
                  background: '#fef2f2',
                  borderRadius: '8px',
                  border: '1px solid #fecaca',
                }}
              >
                <p style={{ color: '#dc2626', fontWeight: 'bold', fontSize: '12px', margin: 0 }}>
                  ⚠️ Estás dentro de una zona de riesgo:
                </p>
                {dentroDe.map((p) => (
                  <p key={p.id} style={{ fontSize: '12px', margin: '4px 0 0', color: '#991b1b' }}>
                    • {p.nombre}
                  </p>
                ))}
                <a href="tel:103" style={popupStyles.button}>
                  📞 Llamar al 103
                </a>
              </div>
            ) : (
              <p style={{ fontSize: '12px', color: '#059669', marginTop: '8px', fontWeight: '600' }}>
                ✅ No estás dentro de ninguna zona de riesgo marcada.
              </p>
            )}
          </div>
        </Popup>
      </Marker>

      <Circle
        center={[location.lat, location.lng]}
        radius={location.accuracy}
        pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.15, weight: 1 }}
      />
    </>
  );
}

/* ===========================
   Componente principal
=========================== */

export default function RiskMap({ 
  puntos, 
  zonasInundables, 
  nivelGlobal = 'verde', 
  lluviaHoy, 
  height = '60vh', 
  userLocation 
}) {
  const { location, error, loading, getUserLocation } = useUserLocation();

  // Usamos la ubicación que viene del exterior (banner) o la del botón interno
  const ubicacionFinal = userLocation || location;

  return (
    <div className="relative w-full h-full" style={{ height }}>
      
      {/* Botón de ubicación interno */}
      <button
        onClick={getUserLocation}
        disabled={loading}
        className={`absolute top-3 right-3 z-[1000] px-3.5 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
          loading
            ? 'bg-slate-900/80 text-white/50 cursor-wait'
            : 'bg-slate-900/90 backdrop-blur-md border border-white/20 text-white hover:bg-slate-800 hover:scale-105'
        }`}
      >
        {loading ? '⏳ Buscando...' : '📍 Mi ubicación'}
      </button>

      {error && (
        <div className="absolute top-16 right-3 z-[1000] max-w-[250px] px-3 py-2 rounded-lg bg-red-500/15 border border-red-400/40 text-red-200 text-xs backdrop-blur-md">
          {error}
        </div>
      )}

      <div className="rounded-2xl overflow-hidden border border-white/10 w-full h-full">
        <MapContainer
          center={[-31.5375, -68.5364]}
          zoom={9}
          maxZoom={19}
          style={{ height: '100%', width: '100%', zIndex: 0, background: '#0a0f1f' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            maxZoom={19}
            className="mapa-dark-filtro"
            opacity={0.9}
          />

          <TileLayer
            url="https://unide.sanjuan.gob.ar/geoserver/wms"
            layers="unide_observ_ambiental_old:2a - Cuencas Tributarias Río San Juan"
            format="image/png"
            transparent={true}
            version="1.1.0"
            opacity={0.5}
            zIndex={40}
            className="wms-hidrografia"
            attribution="Geoportal San Juan"
          />

          <TileLayer
            url="https://unide.sanjuan.gob.ar/geoserver/wms"
            layers="UNIDE_Hidraulica:Canales_Hidraulica"
            format="image/png"
            transparent={true}
            version="1.1.0"
            opacity={0.8}
            zIndex={55}
            className="wms-hidrografia"
            attribution="Geoportal San Juan"
          />

          <TileLayer
            url="https://unide.sanjuan.gob.ar/geoserver/wms"
            layers="unide:Rios_San_Juan"
            format="image/png"
            transparent={true}
            version="1.1.0"
            opacity={1}
            zIndex={60}
            className="wms-hidrografia"
            attribution="Geoportal San Juan"
          />

          <RainRadarLayer opacity={0.6} />

          {/* Zonas inundables dinámicas */}
          {zonasInundables?.map((z) => {
            let estado = 'informativo';
            let color = '#38bdf8';
            let peso = 2;
            let dash = '5, 5';

            if (lluviaHoy !== undefined) {
              if (lluviaHoy >= z.umbralLluviaMm) {
                estado = 'peligro'; color = '#dc2626'; peso = 3; dash = null;
              } else if (lluviaHoy >= z.umbralLluviaMm * 0.5) {
                estado = 'precaucion'; color = '#f59e0b'; peso = 2.5; dash = null;
              }
            }

            return (
              <Circle
                key={z.id}
                center={[z.lat, z.lng]}
                radius={z.radioMetros}
                pathOptions={{ color, fillColor: color, fillOpacity: estado === 'informativo' ? 0.15 : 0.3, weight: peso, dashArray: dash }}
              >
                <Popup>
                  <div style={{ minWidth: '220px' }}>
                    <strong style={popupStyles.title}>{z.nombre}</strong>
                    <span style={popupStyles.badge(color)}>
                      {estado === 'peligro' ? 'PELIGRO' : estado === 'precaucion' ? 'PRECAUCIÓN' : 'INFORMATIVO'}
                    </span>
                    <p style={popupStyles.text}>{z.descripcion}</p>
                    <p style={{ ...popupStyles.text, margin: '6px 0' }}>
                      <span style={popupStyles.label}>⚠️ Umbral:</span> {z.umbralLluviaMm} mm
                    </p>
                    {lluviaHoy !== undefined && (
                      <p style={{ ...popupStyles.text, margin: '4px 0' }}>
                        <span style={popupStyles.label}>Hoy:</span> {lluviaHoy.toFixed(1)} mm esperados
                      </p>
                    )}
                    <p style={{ ...popupStyles.text, margin: '4px 0', fontSize: '11px', color: '#94a3b8' }}>
                      Fuente: {z.fuente}
                    </p>
                  </div>
                </Popup>
              </Circle>
            );
          })}

          {/* Puntos críticos */}
          {puntos.map((p) => {
            const nivelActual = nivelPuntoPorLluvia(p, nivelGlobal);
            const color = coloresNivel[nivelActual];
            return (
              <Circle
                key={p.id}
                center={[p.lat, p.lng]}
                radius={p.radioMetros}
                pathOptions={{ color, fillColor: color, fillOpacity: 0.4, weight: 2 }}
              >
                <Popup>
                  <div style={{ minWidth: '200px' }}>
                    <strong style={popupStyles.title}>{p.nombre}</strong>
                    <span style={popupStyles.badge(color)}>{nivelActual}</span>
                    <p style={popupStyles.text}>{p.descripcion}</p>
                    <p style={popupStyles.text}>
                      <span style={popupStyles.label}>Ruta:</span> {p.rutaEscape}
                    </p>
                    {p.elevacion != null && (
                      <p style={popupStyles.text}>
                        📍 <span style={popupStyles.label}>Elevación:</span> {p.elevacion.toLocaleString('es-AR')} m
                      </p>
                    )}
                    <a href="tel:103" style={popupStyles.button}>📞 Llamar al 103</a>
                  </div>
                </Popup>
              </Circle>
            );
          })}

          {/* Dispara la animación si hay ubicación externa */}
          {ubicacionFinal && <FlyToLocation location={ubicacionFinal} />}

          {/* Dibuja el marcador azul si hay ubicación */}
          {ubicacionFinal && <LocationMarker location={ubicacionFinal} puntos={puntos} />}
        </MapContainer>
      </div>
    </div>
  );
}