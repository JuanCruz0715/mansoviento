import { MapPin } from 'lucide-react';
import { useState, useRef } from 'react';

const DEPARTMENTS = [
  { id: 'capital', name: 'San Juan Capital', lat: -31.5375, lng: -68.5364 },
  { id: 'rawson', name: 'Rawson', lat: -31.6667, lng: -68.4667 },
  { id: 'rivadavia', name: 'Rivadavia', lat: -31.5333, lng: -68.6000 },
  { id: 'santa_lucia', name: 'Santa Lucía', lat: -31.5333, lng: -68.4833 },
  { id: 'chimbas', name: 'Chimbas', lat: -31.4833, lng: -68.5333 },
  { id: 'pocito', name: 'Pocito', lat: -31.6833, lng: -68.5833 },
  { id: 'caucete', name: 'Caucete', lat: -31.6500, lng: -68.2833 },
  { id: 'jachal', name: 'Jáchal', lat: -30.2500, lng: -68.7500 },
  { id: 'albardon', name: 'Albardón', lat: -31.4333, lng: -68.5333 },
  { id: 'angaco', name: 'Angaco', lat: -31.2000, lng: -68.1333 },
  { id: 'iglesia', name: 'Iglesia', lat: -30.3667, lng: -69.3667 },
  { id: 'ullum', name: 'Ullum', lat: -31.0000, lng: -68.7167 },
  { id: 'zonda', name: 'Zonda', lat: -31.5526, lng: -68.7152 },
  { id: 'calingasta', name: 'Calingasta', lat: -31.3333, lng: -69.4167 },
  { id: 'sarmiento', name: 'Sarmiento', lat: -32.0667, lng: -68.5333 },
  { id: '25_de_mayo', name: '25 de Mayo', lat: -31.6667, lng: -68.2333 },
  { id: '9_de_julio', name: '9 de Julio', lat: -31.6507, lng: -68.3899 },
  { id: 'valle_fertil', name: 'Valle Fértil', lat: -30.6333, lng: -67.4667 },
  { id: 'san_martin', name: 'San Martín', lat: -31.5000, lng: -68.3667 },
];

const RIESGO_STYLES = {
  verde: { dot: 'bg-emerald-500', label: 'text-emerald-500' },
  amarillo: { dot: 'bg-amber-500', label: 'text-amber-500' },
  naranja: { dot: 'bg-orange-500', label: 'text-orange-500' },
  rojo: { dot: 'bg-red-500 animate-pulse', label: 'text-red-500' },
};

export const DepartmentsCarousel = ({
  selectedDepartment,
  onDepartmentSelect,
  nivelesPorDepartamento = {},
}) => {
  const scrollContainerRef = useRef(null);

  return (
    <div className="w-full">
      {/* Header del panel */}
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-3.5 h-3.5 text-amber-500" strokeWidth={1.5} />
        <h2 className="text-[10px] font-bold text-white/80 uppercase tracking-widest">
          Departamentos
        </h2>
      </div>

      {/* Lista vertical compacta */}
      <div
        ref={scrollContainerRef}
        className="flex flex-col gap-1 overflow-y-auto max-h-[220px] scrollbar-hide pr-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {DEPARTMENTS.map((dept) => {
          const isActive = selectedDepartment.id === dept.id;
          const nivel = nivelesPorDepartamento[dept.id] || 'verde';
          const riesgo = RIESGO_STYLES[nivel];

          return (
            <button
              key={dept.id}
              onClick={() => onDepartmentSelect(dept)}
              className={`group relative w-full px-3 py-2 rounded-lg border transition-all duration-200 text-left flex justify-between items-center ${
                isActive
                  ? 'bg-amber-500/10 border-amber-500/40'
                  : 'bg-[#050505] border-white/5 hover:bg-white/5'
              }`}
            >
              {/* Nombre */}
              <span className={`text-xs font-medium ${isActive ? 'text-amber-400' : 'text-white/70'}`}>
                {dept.name}
              </span>

              {/* Puntito de riesgo */}
              <span className={`w-2 h-2 rounded-full ${riesgo.dot}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
};