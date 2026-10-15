import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
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

// Mapa de colores por nivel de riesgo
const RIESGO_STYLES = {
  verde: {
    dot: 'bg-emerald-400',
    label: 'text-emerald-400',
    text: 'Sin riesgo',
  },
  amarillo: {
    dot: 'bg-amber-400',
    label: 'text-amber-400',
    text: 'Precaución',
  },
  naranja: {
    dot: 'bg-orange-400',
    label: 'text-orange-400',
    text: 'Alto',
  },
  rojo: {
    dot: 'bg-red-500 animate-pulse',
    label: 'text-red-400',
    text: 'Peligro',
  },
};

export const DepartmentsCarousel = ({
  selectedDepartment,
  onDepartmentSelect,
  nivelesPorDepartamento = {},
}) => {
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 300;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  return (
    <div className="w-full mb-6 relative">
      {/* Header de sección */}
      <div className="flex items-center gap-2 mb-4 px-1">
        <MapPin className="w-4 h-4 text-cyan-400" strokeWidth={1.5} />
        <h2 className="text-sm font-medium text-white/80 uppercase tracking-wider">
          Departamentos de San Juan
        </h2>
      </div>

      {/* Flecha izquierda */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10
                     bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md
                     rounded-full p-2.5 shadow-xl border border-white/20 ml-1
                     transition-all duration-200 hover:scale-110"
          style={{ top: 'calc(50% + 20px)' }}
          aria-label="Desplazar a la izquierda"
        >
          <ChevronLeft className="w-5 h-5 text-white" strokeWidth={2} />
        </button>
      )}

      {/* Flecha derecha */}
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10
                     bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md
                     rounded-full p-2.5 shadow-xl border border-white/20 mr-1
                     transition-all duration-200 hover:scale-110"
          style={{ top: 'calc(50% + 20px)' }}
          aria-label="Desplazar a la derecha"
        >
          <ChevronRight className="w-5 h-5 text-white" strokeWidth={2} />
        </button>
      )}

      {/* Carrusel */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="flex gap-3 overflow-x-auto scrollbar-hide pb-4 px-2 scroll-smooth"
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
              className={`group relative flex-shrink-0 px-4 py-3 rounded-2xl border transition-all duration-200 min-w-[150px] text-left ${
                isActive
                  ? 'bg-white/15 border-cyan-400/50 shadow-lg shadow-cyan-400/10'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              {/* Nombre del departamento */}
              <div
                className={`whitespace-nowrap font-medium text-sm transition-colors ${
                  isActive ? 'text-white' : 'text-white/80 group-hover:text-white'
                }`}
              >
                {dept.name}
              </div>

              {/* Badge de riesgo */}
              <div className="flex items-center gap-1.5 mt-2">
                <span className={`w-1.5 h-1.5 rounded-full ${riesgo.dot}`} />
                <span className={`text-[10px] uppercase tracking-wider font-medium ${riesgo.label}`}>
                  {riesgo.text}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};