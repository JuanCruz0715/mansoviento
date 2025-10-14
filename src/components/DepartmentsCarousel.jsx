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
  { id: 'san_martin', name: 'San Martín', lat: -31.5000, lng: -68.3667 }
];

export const DepartmentsCarousel = ({ selectedDepartment, onDepartmentSelect }) => {
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 300;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
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
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-bold text-gray-800">Departamentos de San Juan</h2>
      </div>
      
      {/* Flechas de navegación MEJORADAS */}
     {showLeftArrow && (
  <button
    onClick={() => scroll('left')}
    className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/95 hover:bg-white rounded-full p-3 shadow-xl border border-gray-300 ml-1 transition-all duration-200 hover:scale-110 hover:shadow-2xl"
    style={{ top: 'calc(44% + 20px)' }} // ← AQUÍ AJUSTÁ LA POSICIÓN VERTICAL
  >
    <ChevronLeft className="w-6 h-6 text-gray-800 font-bold" strokeWidth={2.5} />
  </button>
)}

{showRightArrow && (
  <button
    onClick={() => scroll('right')}
    className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/95 hover:bg-white rounded-full p-3 shadow-xl border border-gray-300 mr-1 transition-all duration-200 hover:scale-110 hover:shadow-2xl"
    style={{ top: 'calc(44% + 20px)' }} // ← AQUÍ AJUSTÁ LA POSICIÓN VERTICAL
  >
    <ChevronRight className="w-6 h-6 text-gray-800 font-bold" strokeWidth={2.5} />
  </button>
)}

      {/* Contenedor del carrusel */}
      <div 
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="flex gap-3 overflow-x-auto scrollbar-hide pb-4 px-2 scroll-smooth"
        style={{ 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {DEPARTMENTS.map((dept) => (
          <button
            key={dept.id}
            onClick={() => onDepartmentSelect(dept)}
            className={`flex-shrink-0 px-4 py-3 rounded-xl border-2 transition-all duration-200 min-w-[140px] ${
              selectedDepartment.id === dept.id
                ? 'bg-orange-300 border-orange-300 text-black shadow-lg scale-105'
                : 'bg-white/70 border-white/40 text-gray-800 hover:bg-white/90 hover:shadow-md hover:border-blue-200'
            }`}
          >
            <div className="text-center whitespace-nowrap font-medium text-sm">
              {dept.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};