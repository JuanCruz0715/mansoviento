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
import { AlertaInminente } from '../components/AlertaInminente';

const RiskMap = lazy(() => import('../components/RiskMap'));

export default function WeatherApp({ nivelesPorDepartamento = {} }) {
  const [selectedLocation, setSelectedLocation] = useState({
    lat: -31.5375,
    lng: -68.5364,
    name: 'San Juan Capital',
    id: 'capital',
  });

  // 🎯 NUEVO: Estado para compartir la ubicación del usuario
  const [userLocation, setUserLocation] = useState(null);

  const { currentWeather, hourlyForecast, loading } = useWeather(selectedLocation);
  const { alerts } = useWeatherAlerts(hourlyForecast);

  const lluviaHoy = hourlyForecast?.[0]?.hours?.reduce(
    (sum, h) => sum + (h.precipitation || 0),
    0
  ) || 0;

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

      <div className="relative z-10 pt-16 h-auto lg:h-[calc(100vh-64px)] lg:overflow-hidden">
        <div className="h-full max-w-[1600px] mx-auto p-3 sm:p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 h-full">
            
            {/* 🟢 COLUMNA IZQUIERDA */}
            <div className="lg:col-span-3 flex flex-col gap-4 lg:overflow-y-auto lg:pr-2 scrollbar-hide pb-4 lg:pb-0">
              {/* Pasamos la función setUserLocation para que el banner actualice el mapa */}
              <AlertaInminente onLocationFound={(loc) => setUserLocation(loc)} />
              
              <DepartmentsCarousel
                selectedDepartment={selectedLocation}
                onDepartmentSelect={handleDepartmentSelect}
                nivelesPorDepartamento={nivelesPorDepartamento}
              />
              
              <CurrentWeather
                currentWeather={currentWeather}
                getWindDirection={getWindDirection}
                customLocation={selectedLocation}
              />
            </div>

            {/* 🗺️ COLUMNA CENTRAL */}
            <div className="lg:col-span-6 flex flex-col h-[60vh] lg:h-full gap-4">
              <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-1 shadow-2xl shadow-black/20 flex-grow relative overflow-hidden">
                <Suspense
                  fallback={
                    <div className="h-full flex items-center justify-center">
                      <p className="text-white/50 text-sm">Cargando mapa...</p>
                    </div>
                  }
                >
                  {/* Le pasamos la ubicación compartida al mapa */}
                  <RiskMap
                    puntos={puntosCriticos}
                    zonasInundables={zonasInundables}
                    nivelGlobal="verde"
                    lluviaHoy={lluviaHoy}
                    height="100%"
                    userLocation={userLocation}
                  />
                </Suspense>
              </div>

              {/* Leyenda compacta */}
              <div className="hidden lg:block rounded-2xl bg-white/5 border border-white/10 p-3">
                <div className="flex flex-wrap items-center justify-between gap-4 text-[10px] text-white/60">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-sky-400/20 border border-dashed border-sky-400" /> Informativo
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500/30 border border-amber-400" /> Precaución
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/30 border border-red-400 animate-pulse" /> Peligro
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-0.5 bg-cyan-400" /> Ríos
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-0.5 bg-blue-400" /> Canales
                  </div>
                </div>
              </div>
            </div>

            {/* 🔵 COLUMNA DERECHA */}
            <div className="lg:col-span-3 flex flex-col gap-4 lg:overflow-y-auto lg:pl-2 scrollbar-hide pb-4 lg:pb-0">
              <WeatherAlerts alerts={alerts} />
              <WeatherForecast hourlyForecast={hourlyForecast} />
              
              <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-4">
                <h3 className="text-[10px] font-medium text-red-300 uppercase tracking-wider mb-3 flex items-center gap-1">
                  🚨 Si tenés que evacuar
                </h3>
                <div className="flex flex-col gap-2">
                  <a href="tel:103" className="text-sm font-medium text-white/70 hover:text-white transition-colors flex items-center gap-2">
                    📞 Protección Civil: 103
                  </a>
                  <a href="tel:911" className="text-sm font-medium text-white/70 hover:text-white transition-colors flex items-center gap-2">
                    📞 Emergencias: 911
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}