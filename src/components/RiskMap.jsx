import { MapContainer, TileLayer, Circle, Popup, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';
import { Cloud, CloudOff, Thermometer, ThermometerSnowflake } from 'lucide-react';
import { coloresNivel, nivelPuntoPorLluvia } from '../utils/riskUtils';
import { puntosCercanos } from '../utils/geoUtils';
import { useUserLocation } from '../hooks/useUserLocation';

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
        const res = await fetch('https://api.rainviewer.com/public/weather-maps.json');
        if (!res.ok) throw new Error('Error');
        const data = await res.json();
        const frames = data.radar?.past || [];
        const latest = frames[frames.length - 1];
        if (latest && !cancelled) setRadarUrl(`${data.host}${latest.path}`);
      } catch (e) { console.error(e); }
    }
    loadRadar();
    return () => { cancelled = true; };
  }, []);
  if (!radarUrl) return null;
  return <TileLayer url={`${radarUrl}/256/{z}/{x}/{y}/2/1_1.png`} opacity={opacity} zIndex={100} maxNativeZoom={7} maxZoom={19} tileSize={256} />;
}

/* ===========================
   Animación de vuelo
=========================== */
function FlyToLocation({ location }) {
  const map = useMap();
  useEffect(() => {
    if (location) map.flyTo([location.lat, location.lng], 11, { duration: 1.5 });
  }, [location, map]);
  return null;
}

/* ===========================
   Estilos de popup
=========================== */
const popupStyles = {
  title: { fontSize: '14px', fontWeight: 600, color: '#0f172a', marginRight: '6px' },
  badge: (color) => ({
    display: 'inline-block', padding: '2px 8px', fontSize: '10px', borderRadius: '999px',
    background: color + '20', color, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em',
  }),
  text: { margin: '8px 0 4px', fontSize: '12px', color: '#475569', lineHeight: 1.5 },
  label: { fontWeight: 600, color: '#1e293b' },
  button: { display: 'inline-block', marginTop: '8px', padding: '6px 12px', background: '#dc2626', color: 'white', borderRadius: '6px', textDecoration: 'none', fontSize: '12px', fontWeight: 600 },
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
              <div style={{ marginTop: '8px', padding: '10px', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
                <p style={{ color: '#dc2626', fontWeight: 'bold', fontSize: '12px', margin: 0 }}>⚠️ Zona de riesgo:</p>
                {dentroDe.map((p) => <p key={p.id} style={{ fontSize: '12px', margin: '4px 0 0', color: '#991b1b' }}>• {p.nombre}</p>)}
              </div>
            ) : (
              <p style={{ fontSize: '12px', color: '#059669', marginTop: '8px', fontWeight: '600' }}>✅ Zona segura.</p>
            )}
          </div>
        </Popup>
      </Marker>
      <Circle center={[location.lat, location.lng]} radius={location.accuracy || 100} pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.15, weight: 1 }} />
    </>
  );
}

/* ===========================
   Componente principal
=========================== */
export default function RiskMap({ 
  puntos, zonasInundables, nivelGlobal = 'verde', lluviaHoy, height = '60vh', userLocation, selectedLocation, apiKey
}) {
  const { location, error, loading, getUserLocation } = useUserLocation();
  const ubicacionFinal = userLocation || selectedLocation;

  const [showClouds, setShowClouds] = useState(false);
  const [showTemp, setShowTemp] = useState(false);

  return (
    <div className="relative w-full h-full" style={{ height }}>
      
      {/* 🎛️ PANEL DE CONTROLES FLOTANTE (Izquierda) */}
      <div className="absolute top-3 left-12 z-[1000] flex flex-col gap-1.5">
        <button
          onClick={() => setShowClouds(!showClouds)}
          className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all duration-200 border shadow-lg flex items-center gap-1.5 ${
            showClouds ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50' : 'bg-slate-900/90 text-white/50 border-white/10 hover:text-white'
          }`}
        >
          {showClouds ? <Cloud className="w-3 h-3" /> : <CloudOff className="w-3 h-3" />}
          Nubes
        </button>

        <button
          onClick={() => setShowTemp(!showTemp)}
          className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all duration-200 border shadow-lg flex items-center gap-1.5 ${
            showTemp ? 'bg-orange-500/20 text-orange-300 border-orange-500/50' : 'bg-slate-900/90 text-white/50 border-white/10 hover:text-white'
          }`}
        >
          {showTemp ? <Thermometer className="w-3 h-3" /> : <ThermometerSnowflake className="w-3 h-3" />}
          Temp
        </button>
      </div>

      {/* Botón de ubicación (Derecha) */}
      <button
        onClick={getUserLocation}
        disabled={loading}
        className={`absolute top-3 right-3 z-[1000] px-3.5 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
          loading ? 'bg-slate-900/80 text-white/50 cursor-wait' : 'bg-slate-900/90 backdrop-blur-md border border-white/20 text-white hover:bg-slate-800 hover:scale-105'
        }`}
      >
        {loading ? '⏳...' : '📍 Mi ubicación'}
      </button>

      <div className="rounded-xl overflow-hidden border border-white/5 w-full h-full">
        <MapContainer
  bounds={[
    [-32.8, -70.8], // Extremo Suroeste (abajo a la izquierda)
    [-28.2, -66.5]  // Extremo Noreste (arriba a la derecha)
  ]}
  boundsOptions={{ padding: [20, 20] }}
  maxZoom={19}
  style={{ height: '100%', width: '100%', zIndex: 0, background: '#0a0f1f' }}
  scrollWheelZoom={false} // O true si querés habilitarlo
>
          
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" maxZoom={19} className="mapa-dark-filtro" opacity={0.9} />

          {showClouds && apiKey && (
            <TileLayer url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${apiKey}`} opacity={0.4} zIndex={30} />
          )}

          {showTemp && apiKey && (
            <TileLayer url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`} opacity={0.5} zIndex={35} />
          )}

          <TileLayer url="https://unide.sanjuan.gob.ar/geoserver/wms" layers="unide_observ_ambiental_old:2a - Cuencas Tributarias Río San Juan" format="image/png" transparent={true} version="1.1.0" opacity={0.5} zIndex={40} className="wms-hidrografia" />
          <TileLayer url="https://unide.sanjuan.gob.ar/geoserver/wms" layers="UNIDE_Hidraulica:Canales_Hidraulica" format="image/png" transparent={true} version="1.1.0" opacity={0.8} zIndex={55} className="wms-hidrografia" />
          <TileLayer url="https://unide.sanjuan.gob.ar/geoserver/wms" layers="unide:Rios_San_Juan" format="image/png" transparent={true} version="1.1.0" opacity={1} zIndex={60} className="wms-hidrografia" />

          <RainRadarLayer opacity={0.6} />

          {zonasInundables?.map((z) => {
            let estado = 'info'; let color = '#38bdf8'; let peso = 2; let dash = '5, 5';
            if (lluviaHoy !== undefined) {
              if (lluviaHoy >= z.umbralLluviaMm) { estado = 'peligro'; color = '#dc2626'; peso = 3; dash = null; }
              else if (lluviaHoy >= z.umbralLluviaMm * 0.5) { estado = 'precaucion'; color = '#f59e0b'; peso = 2.5; dash = null; }
            }
            return (
              <Circle key={z.id} center={[z.lat, z.lng]} radius={z.radioMetros} pathOptions={{ color, fillColor: color, fillOpacity: estado === 'info' ? 0.15 : 0.3, weight: peso, dashArray: dash }}>
                <Popup>
                  <div style={{ minWidth: '220px' }}>
                    <strong style={popupStyles.title}>{z.nombre}</strong>
                    <span style={popupStyles.badge(color)}>{estado}</span>
                    <p style={popupStyles.text}>{z.descripcion}</p>
                    {lluviaHoy !== undefined && <p style={{ ...popupStyles.text, margin: '4px 0' }}><span style={popupStyles.label}>Hoy:</span> {lluviaHoy.toFixed(1)} mm</p>}
                  </div>
                </Popup>
              </Circle>
            );
          })}

          {puntos.map((p) => {
            const nivelActual = nivelPuntoPorLluvia(p, nivelGlobal);
            const color = coloresNivel[nivelActual];
            return (
              <Circle key={p.id} center={[p.lat, p.lng]} radius={p.radioMetros} pathOptions={{ color, fillColor: color, fillOpacity: 0.4, weight: 2 }}>
                <Popup>
                  <div style={{ minWidth: '200px' }}>
                    <strong style={popupStyles.title}>{p.nombre}</strong>
                    <span style={popupStyles.badge(color)}>{nivelActual}</span>
                    <p style={popupStyles.text}>{p.descripcion}</p>
                  </div>
                </Popup>
              </Circle>
            );
          })}

          <FlyToLocation location={ubicacionFinal} />
          {userLocation && <LocationMarker location={userLocation} puntos={puntos} />}
        </MapContainer>
      </div>

      {/* 🌡️ BARRA DE TEMPERATURA (Solo visible si showTemp es true) */}
      {showTemp && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-[280px] bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-full px-3 py-2 shadow-2xl flex flex-col gap-1">
          <div className="flex justify-between text-[9px] font-bold text-white/50 uppercase tracking-widest px-1">
            <span>Frío</span>
            <span>Templado</span>
            <span>Calor</span>
          </div>
          {/* Gradiente de colores (simula la paleta de OpenWeatherMap) */}
          <div className="h-2 w-full rounded-full" style={{
            background: 'linear-gradient(to right, #4b0082, #0000ff, #00ffff, #00ff00, #ffff00, #ffa500, #ff0000)'
          }} />
        </div>
      )}
    </div>
  );
}