import { Info } from 'lucide-react';

export const TabsNav = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/70 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo + Nombre */}
        <a href="/" className="flex items-center gap-3 group">
          {/* SVG: Montaña + viento - MÁS GRANDE */}
          <svg
            width="42"
            height="42"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0 transition-transform group-hover:scale-105"
          >
            <defs>
              <linearGradient id="windGradientNav" x1="10" y1="0" x2="54" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#22d3ee" />
                <stop offset="1" stopColor="#06b6d4" />
              </linearGradient>
            </defs>

            {/* Silueta de montaña - más clara */}
            <path
              d="M4 52 L16 34 L24 42 L34 26 L44 38 L52 30 L60 40 L60 60 L4 60 Z"
              fill="#334155"
            />

            {/* Nieve en la cima */}
            <path
              d="M32 26 L34 26 L36 30 L32 32 L28 30 Z"
              fill="#e2e8f0"
            />

            {/* Líneas de viento - más gruesas */}
            <path
              d="M8 22 Q20 18 32 22 T56 22"
              stroke="url(#windGradientNav)"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M12 16 Q24 12 36 16 T56 14"
              stroke="url(#windGradientNav)"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              opacity="0.75"
            />
            <path
              d="M16 10 Q26 7 36 10 T54 8"
              stroke="url(#windGradientNav)"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.5"
            />
          </svg>

          {/* Nombre - MÁS GRANDE */}
          <div className="flex flex-col leading-none">
            <span className="text-cyan-400 font-bold text-base sm:text-lg tracking-tight group-hover:text-cyan-300 transition-colors">
              MANSO VIENTO
            </span>
            <span className="text-white/40 text-[10px] uppercase tracking-widest mt-1 hidden sm:inline">
              San Juan
            </span>
          </div>
        </a>

        {/* Link a Acerca */}
        <a
          href="/acerca"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-white/50 hover:text-white/80 hover:bg-white/5 transition-all duration-200"
        >
          <Info className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>Acerca</span>
        </a>

      </div>
    </nav>
  );
};