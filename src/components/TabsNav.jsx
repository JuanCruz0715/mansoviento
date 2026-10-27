import { Info } from 'lucide-react';

export const TabsNav = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo + Nombre */}
        <a href="/" className="flex items-center gap-3 group">
          <svg width="32" height="32" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
            <defs>
              <linearGradient id="windGradientNav" x1="10" y1="0" x2="54" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#22d3ee" />
                <stop offset="1" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <path d="M4 52 L16 34 L24 42 L34 26 L44 38 L52 30 L60 40 L60 60 L4 60 Z" fill="#1e293b" />
            <path d="M32 26 L34 26 L36 30 L32 32 L28 30 Z" fill="#e2e8f0" />
            <path d="M8 22 Q20 18 32 22 T56 22" stroke="url(#windGradientNav)" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M12 16 Q24 12 36 16 T56 14" stroke="url(#windGradientNav)" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.75" />
          </svg>

          <div className="flex flex-col leading-none">
            <span className="text-white font-bold text-base tracking-tight">MANSO VIENTO</span>
            <span className="text-amber-500/80 text-[9px] uppercase tracking-[0.2em] mt-1 font-semibold">
              San Juan · Monitoreo
            </span>
          </div>
        </a>

        {/* Links */}
        <div className="flex items-center gap-6">
          <a href="/acerca" className="flex items-center gap-2 text-xs font-medium text-white/50 hover:text-white transition-colors">
            <Info className="w-3.5 h-3.5" />
            <span className="hidden sm:inline uppercase tracking-wider">Acerca de</span>
          </a>
        </div>

      </div>
    </nav>
  );
};