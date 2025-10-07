import { useSkyAnimation } from '../hooks/useSkyAnimation';

export const AnimatedSky = () => {
  const sky = useSkyAnimation();

  return (
    <div 
      className="fixed inset-0 transition-all duration-1000 z-0"
      style={{ 
        background: sky.background,
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Efectos de nubes sutiles */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-16 bg-white rounded-full blur-xl"></div>
        <div className="absolute top-1/3 right-1/3 w-48 h-20 bg-white rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-24 bg-white rounded-full blur-xl"></div>
      </div>

      {/* Efecto de horizonte */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 transition-all duration-1000"
        style={{
          background: `linear-gradient(to top, ${
            sky.isDay ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.2)'
          }, transparent)`
        }}
      ></div>
    </div>
  );
};