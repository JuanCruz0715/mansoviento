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

// 🎯 Poné acá tu API Key de OpenWeatherMap
const OWM_API_KEY = 'a4bc9566579c0764802ec6e156db2b2a';

export default function WeatherApp({ nivelesPorDepartamento = {} }) {
  const [selectedLocation, setSelectedLocation] = useState({
    lat: -31.5375,
    lng: -68.5364,
    name: 'San Juan Capital',
    id: 'capital',
  });

  // Estado para compartir la ubicación del usuario (GPS)
  const [userLocation, setUserLocation] = useState(null);

  const { currentWeather, hourlyForecast, loading } = useWeather(selectedLocation);
  const { alerts } = useWeatherAlerts(hourlyForecast);

  const lluviaHoy = hourlyForecast?.[0]?.hours?.reduce(
    (sum, h) => sum + (h.precipitation || 0),
    0
  ) || 0;

  const handleDepartmentSelect = (department) => {
    // 🔥 FIX: Al cambiar de departamento, borramos el GPS para que el mapa vuele al depto y no a tu casa
    setUserLocation(null); 
    
    setSelectedLocation({
      lat: department.lat,
      lng: department.lng,
      name: department.name,
      id: department.id,
    });
  };

  // 🔥 FIX: Cuando el usuario verifica su zona, actualizamos el clima a su ubicación real
  const handleLocationFound = (loc) => {
    setUserLocation(loc);
    setSelectedLocation({
      lat: loc.lat,
      lng: loc.lng,
      name: 'Mi ubicación',
      id: 'user_location',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-4">
        <StaticBackground />
        <TabsNav />
        <div className="relative z-10 text-amber-500 font-mono text-sm tracking-widest uppercase text-center pt-14 animate-pulse">
          Estableciendo conexión...
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
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 h-full">
            
            {/* 🟢 COLUMNA IZQUIERDA: Alertas, Deptos, Clima (3/12) */}
            <div className="lg:col-span-3 flex flex-col gap-4 lg:overflow-y-auto scrollbar-hide pb-4 lg:pb-0 pr-1">
              
              <AlertaInminente onLocationFound={handleLocationFound} />
              
              <div className="rounded-xl bg-[#0f0f11] border border-white/5 p-4 shadow-xl">
                <DepartmentsCarousel
                  selectedDepartment={selectedLocation}
                  onDepartmentSelect={handleDepartmentSelect}
                  nivelesPorDepartamento={nivelesPorDepartamento}
                />
              </div>

              <CurrentWeather
                currentWeather={currentWeather}
                getWindDirection={getWindDirection}
                customLocation={selectedLocation}
              />
            </div>

            {/* 🗺️ COLUMNA CENTRAL: Mapa (6/12) */}
            <div className="lg:col-span-6 flex flex-col h-[60vh] lg:h-full gap-3">
              
              <div className="rounded-xl bg-[#0f0f11] border border-white/5 p-1 shadow-2xl flex-grow relative overflow-hidden">
                <Suspense
                  fallback={
                    <div className="h-full flex items-center justify-center">
                      <p className="text-amber-500/50 text-xs uppercase tracking-widest animate-pulse">Cargando radar...</p>
                    </div>
                  }
                >
                  <RiskMap
                    puntos={puntosCriticos}
                    zonasInundables={zonasInundables}
                    nivelGlobal="verde"
                    lluviaHoy={lluviaHoy}
                    height="100%"
                    userLocation={userLocation}
                    selectedLocation={selectedLocation}
                    apiKey={OWM_API_KEY} // 👈 Le pasamos la key para las nubes
                  />
                </Suspense>
              </div>

              {/* Leyenda compacta */}
              <div className="hidden lg:block shrink-0 rounded-xl bg-[#0f0f11] border border-white/5 p-3">
                <div className="flex flex-wrap items-center justify-between gap-4 text-[10px] text-white/50 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full border border-sky-400/50" /> Informativo
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/50" /> Precaución
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/50" /> Peligro
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

            {/* 🔵 COLUMNA DERECHA: Alertas Activas, Pronóstico (3/12) */}
            <div className="lg:col-span-3 flex flex-col gap-4 lg:overflow-y-auto scrollbar-hide pb-4 lg:pb-0 pl-1">
              
              <WeatherAlerts alerts={alerts} />
              
              <div className="flex-1 min-h-0">
                <WeatherForecast hourlyForecast={hourlyForecast} />
              </div>
              
              {/* Panel de emergencia */}
              <div className="mt-auto shrink-0 rounded-xl bg-[#0f0f11] border border-red-500/30 p-4 shadow-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-colors" />
                <h3 className="relative text-[10px] font-bold text-red-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  Evacuación
                </h3>
                <div className="relative flex flex-col gap-2">
                  <a href="tel:103" className="text-sm font-medium text-white/80 hover:text-white transition-colors flex items-center justify-between">
                    <span>Protección Civil</span>
                    <span className="text-red-400 font-mono text-xs">103</span>
                  </a>
                  <a href="tel:911" className="text-sm font-medium text-white/80 hover:text-white transition-colors flex items-center justify-between">
                    <span>Emergencias</span>
                    <span className="text-red-400 font-mono text-xs">911</span>
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