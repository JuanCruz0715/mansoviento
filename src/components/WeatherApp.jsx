import { useState, lazy, Suspense } from 'react';
import { useWeather, useWeatherAlerts } from '../hooks/useWeather';
import { StaticBackground } from '../components/StaticBackground';
import { TabsNav } from '../components/TabsNav';
import { getWindDirection } from '../utils/windUtils';
import puntosCriticos from '../data/puntosCriticos.json';
import zonasInundables from '../data/zonasInundables.json';

import { CurrentWeather } from '../components/CurrentWeather';
import { WeatherForecast } from '../components/WeatherForecast';
import { DepartmentsCarousel } from '../components/DepartmentsCarousel';
import { WeatherAlerts } from '../components/WeatherAlerts';

const RiskMap = lazy(() => import('../components/RiskMap'));

export default function WeatherApp({ nivelesPorDepartamento = {} }) {
  const [selectedLocation, setSelectedLocation] = useState({
    lat: -31.5375,
    lng: -68.5364,
    name: 'San Juan Capital',
    id: 'capital',
  });

  const { currentWeather, hourlyForecast, loading } = useWeather(selectedLocation);
  const { alerts } = useWeatherAlerts(hourlyForecast);

  const handleDepartmentSelect = (department) => {
    setSelectedLocation({
      lat: department.lat,
      lng: department.lng,
      name: department.name,
      id: department.id,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-4">
        <StaticBackground />
        <TabsNav />
        <div className="relative z-10 text-white/80 text-lg sm:text-xl text-center pt-14">
          Cargando datos para {selectedLocation.name}...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <StaticBackground />

      <TabsNav />

      <div className="relative z-10 pt-20 pb-6 px-3 sm:px-4 md:px-6">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* Carrusel de departamentos */}
          <DepartmentsCarousel
            selectedDepartment={selectedLocation}
            onDepartmentSelect={handleDepartmentSelect}
            nivelesPorDepartamento={nivelesPorDepartamento}
          />

          {/* Clima actual */}
          <CurrentWeather
            currentWeather={currentWeather}
            getWindDirection={getWindDirection}
            customLocation={selectedLocation}
          />

          {/* Alertas */}
          <WeatherAlerts alerts={alerts} />

          {/* Pronóstico 7 días */}
          <WeatherForecast hourlyForecast={hourlyForecast} />

          {/* Header del mapa */}
          <div className="flex items-center gap-2 px-1 pt-4">
            <span className="text-cyan-400 text-base">🗺️</span>
            <h3 className="text-sm font-medium text-white/80 uppercase tracking-wider">
              Mapa de riesgo hídrico
            </h3>
          </div>

          {/* Mapa de riesgo */}
          <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-2 shadow-2xl shadow-black/20 overflow-hidden">
            <Suspense
              fallback={
                <div className="h-[60vh] flex items-center justify-center">
                  <p className="text-white/50 text-sm">Cargando mapa...</p>
                </div>
              }
            >
              <RiskMap
                puntos={puntosCriticos}
                zonasInundables={zonasInundables}
                nivelGlobal="verde"
              />
            </Suspense>
          </div>

          {/* Leyenda del mapa */}
          <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-5 shadow-2xl shadow-black/20">
            <h3 className="text-sm font-medium text-white/80 uppercase tracking-wider mb-4">
              📖 Leyenda del mapa
            </h3>

            {/* Niveles de riesgo */}
            <div className="mb-5">
              <p className="text-[10px] uppercase tracking-widest text-white/40 font-medium mb-2">
                Niveles de riesgo
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-red-500/60 border-2 border-red-400 flex-shrink-0" />
                  <span className="text-white/70">Alto</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-orange-500/60 border-2 border-orange-400 flex-shrink-0" />
                  <span className="text-white/70">Moderado</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-amber-500/60 border-2 border-amber-400 flex-shrink-0" />
                  <span className="text-white/70">Precaución</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/60 border-2 border-emerald-400 flex-shrink-0" />
                  <span className="text-white/70">Sin riesgo</span>
                </div>
              </div>
            </div>

            {/* Capas hidrográficas */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/40 font-medium mb-2">
                Capas hidrográficas
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">

                {/* Ríos oficiales */}
                <div className="flex items-start gap-3">
                  <span className="w-6 h-0.5 rounded-full bg-cyan-400 flex-shrink-0 mt-2" />
                  <div>
                    <p className="text-white/80">Ríos y arroyos</p>
                    <p className="text-[10px] text-white/40">Cauce oficial · Geoportal SJ</p>
                  </div>
                </div>

                {/* Canales */}
                <div className="flex items-start gap-3">
                  <span className="w-6 h-0.5 rounded-full bg-blue-400 flex-shrink-0 mt-2" />
                  <div>
                    <p className="text-white/80">Canales de riego</p>
                    <p className="text-[10px] text-white/40">Red de Hidráulica · pueden desbordar</p>
                  </div>
                </div>

                {/* Cuencas */}
                <div className="flex items-start gap-3">
                  <span className="w-6 h-3 rounded-sm bg-violet-500/30 border border-violet-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-white/80">Cuencas tributarias</p>
                    <p className="text-[10px] text-white/40">Zonas que drenan al río SJ</p>
                  </div>
                </div>

                {/* Zonas inundables */}
                <div className="flex items-start gap-3">
                  <span className="w-4 h-4 rounded-full bg-sky-400/40 border-2 border-dashed border-sky-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white/80">Zona inundable</p>
                    <p className="text-[10px] text-white/40">Se activa con X mm de lluvia</p>
                  </div>
                </div>

                {/* Radar de lluvia */}
                <div className="flex items-start gap-3">
                  <span className="w-4 h-4 rounded-sm bg-gradient-to-br from-blue-400/60 to-cyan-400/60 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white/80">Radar de lluvia</p>
                    <p className="text-[10px] text-white/40">Actualización cada 10 min</p>
                  </div>
                </div>

              </div>
            </div>

            <p className="text-xs text-white/40 mt-4 leading-relaxed">
              Los ríos, canales y cuencas son datos oficiales del Geoportal de San Juan (UNIDE).
              El radar de lluvia se actualiza cada 10 minutos (fuente: RainViewer).
            </p>
          </div>

          {/* Panel de emergencia */}
          <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
            <h3 className="text-sm font-medium text-white/80 uppercase tracking-wider mb-4">
              🚨 Si tenés que evacuar
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-white/70 text-sm mb-5">
              <li>No cruces rutas ni calles con agua en movimiento.</li>
              <li>Dirigite a la zona más alta y segura más cercana.</li>
              <li>Cortá la luz y el gas antes de salir.</li>
              <li>Llevá documentos, agua y medicamentos.</li>
              <li>Avisá a un familiar o vecino hacia dónde vas.</li>
            </ol>
            <div className="flex flex-wrap gap-2">
              <a
                href="tel:103"
                className="px-4 py-2 rounded-full bg-red-500/20 border border-red-400/40 text-red-200 text-sm font-medium hover:bg-red-500/30 transition-colors"
              >
                📞 Protección Civil: 103
              </a>
              <a
                href="tel:911"
                className="px-4 py-2 rounded-full bg-red-500/20 border border-red-400/40 text-red-200 text-sm font-medium hover:bg-red-500/30 transition-colors"
              >
                📞 Emergencias: 911
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}