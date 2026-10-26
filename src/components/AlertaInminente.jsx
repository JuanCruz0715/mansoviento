import { useState, useEffect } from 'react';
import { AlertTriangle, X, Droplets, ShieldAlert } from 'lucide-react';
import { useUserLocation } from '../hooks/useUserLocation';
import { useWeather } from '../hooks/useWeather';
import { puntosCercanos } from '../utils/geoUtils';
import zonasInundables from '../data/zonasInundables.json';
import puntosCriticos from '../data/puntosCriticos.json';

export const AlertaInminente = ({ onLocationFound }) => {
  const [dismissed, setDismissed] = useState(false);
  const [alerta, setAlerta] = useState(null);
  const [checking, setChecking] = useState(false);
  
  const { location, loading, getUserLocation } = useUserLocation();
  const { hourlyForecast } = useWeather(
    location || { lat: -31.5375, lng: -68.5364 }
  );

  const handleCheck = () => {
    setChecking(true);
    getUserLocation();
  };

  useEffect(() => {
    // Si encontramos la ubicación, avisamos al padre (para que el mapa haga zoom)
    if (location && onLocationFound) {
      onLocationFound(location);
    }

    if (!location || !hourlyForecast || !checking) return;

    const hoy = hourlyForecast[0];
    if (!hoy?.hours) return;

    const lluviaHoy = hoy.hours.reduce((sum, h) => sum + (h.precipitation || 0), 0);
    const puntosCerca = puntosCercanos(location.lat, location.lng, puntosCriticos);

    const zonasCerca = zonasInundables.filter((z) => {
      const dist = Math.sqrt(
        Math.pow((z.lat - location.lat) * 111000, 2) +
        Math.pow((z.lng - location.lng) * 95000, 2)
      );
      return dist <= z.radioMetros;
    });

    let umbralMinimo = null;
    if (zonasCerca.length > 0) {
      umbralMinimo = Math.min(...zonasCerca.map((z) => z.umbralLluviaMm));
    }

    let nivelAlerta = null;

    if (umbralMinimo !== null && lluviaHoy >= umbralMinimo) {
      nivelAlerta = 'rojo';
    } else if (umbralMinimo !== null && lluviaHoy >= umbralMinimo * 0.5) {
      nivelAlerta = 'amarillo';
    } else if (puntosCerca.length > 0 && lluviaHoy > 10) {
      nivelAlerta = 'amarillo';
    }

    if (nivelAlerta) {
      setAlerta({
        nivel: nivelAlerta,
        lluviaHoy: lluviaHoy.toFixed(1),
        umbral: umbralMinimo,
        zonas: zonasCerca,
        puntos: puntosCerca,
      });
    } else {
      setAlerta({
        nivel: 'seguro',
        lluviaHoy: lluviaHoy.toFixed(1),
        zonas: zonasCerca,
        puntos: puntosCerca,
      });
    }
    
    setChecking(false);
  }, [location, hourlyForecast, checking, onLocationFound]);

  if (dismissed) return null;

  // ESTADO INICIAL
  if (!alerta) {
    return (
      <div className="rounded-3xl bg-cyan-500/5 backdrop-blur-xl border border-cyan-400/30 p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
            <ShieldAlert className="w-5 h-5 text-cyan-300" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">¿Estás en zona de riesgo?</p>
            <p className="text-xs text-white/50">Verificá si tu ubicación puede inundarse hoy</p>
          </div>
        </div>
        <button
          onClick={handleCheck}
          disabled={loading || checking}
          className="px-4 py-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 text-sm font-bold transition-colors w-full sm:w-auto flex-shrink-0"
        >
          {loading || checking ? 'Verificando...' : 'Verificar mi zona'}
        </button>
      </div>
    );
  }

  // ESTADO SEGURO
  if (alerta.nivel === 'seguro') {
    return (
      <div className="rounded-3xl bg-emerald-500/10 backdrop-blur-xl border border-emerald-400/30 p-4 shadow-lg flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <Droplets className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-300">Estás en una zona segura</p>
            <p className="text-xs text-white/60">
              {alerta.lluviaHoy} mm esperados hoy · No se detectan riesgos para tu ubicación.
            </p>
          </div>
        </div>
        <button onClick={() => setDismissed(true)} className="p-2 rounded-full hover:bg-white/10">
          <X className="w-4 h-4 text-white/50" />
        </button>
      </div>
    );
  }

  // ESTADO RIESGO
  const esRojo = alerta.nivel === 'rojo';

  return (
    <div
      className={`relative rounded-3xl border-2 p-5 shadow-2xl ${
        esRojo
          ? 'bg-red-500/15 border-red-500 backdrop-blur-xl shadow-red-500/20'
          : 'bg-amber-500/15 border-amber-500 backdrop-blur-xl shadow-amber-500/20'
      }`}
    >
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/10 transition-colors"
      >
        <X className="w-4 h-4 text-white/50" />
      </button>

      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle
          className={`w-5 h-5 ${esRojo ? 'text-red-400 animate-pulse' : 'text-amber-400'}`}
          strokeWidth={2}
        />
        <h3 className={`text-base font-bold uppercase tracking-wider ${esRojo ? 'text-red-300' : 'text-amber-300'}`}>
          {esRojo ? '🚨 Riesgo de inundación ahora' : '⚠️ Precaución en tu zona'}
        </h3>
      </div>

      <p className="text-white/90 text-sm mb-4 leading-relaxed">
        {esRojo ? (
          <>
            Estás en una zona vulnerable y se esperan <strong className="text-red-300">{alerta.lluviaHoy} mm</strong> de lluvia hoy.
            {alerta.umbral && <> Supera el umbral de <strong className="text-red-300">{alerta.umbral} mm</strong>.</>}
          </>
        ) : (
          <>
            Estás cerca de una zona de riesgo. Se esperan <strong className="text-amber-300">{alerta.lluviaHoy} mm</strong> de lluvia hoy.
          </>
        )}
      </p>

      {alerta.zonas.length > 0 && (
        <div className="mb-4">
          <p className="text-[10px] uppercase tracking-widest text-white/50 mb-2">Zonas cercanas</p>
          <div className="flex flex-wrap gap-2">
            {alerta.zonas.map((z) => (
              <span key={z.id} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-200 text-xs">
                <Droplets className="w-3 h-3" />
                {z.nombre}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <a
          href="tel:103"
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
            esRojo ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-amber-500 hover:bg-amber-600 text-slate-900'
          }`}
        >
          📞 Llamar a Protección Civil
        </a>
        <button
          onClick={() => { setAlerta(null); setChecking(false); }}
          className="px-4 py-2 rounded-full text-sm font-semibold bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors"
        >
          Volver a verificar
        </button>
      </div>
    </div>
  );
};