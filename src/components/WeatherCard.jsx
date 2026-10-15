export default function WeatherCard({
  icon: Icon,
  title,
  value,
  subtitle,
  className = "",
  children
}) {
  return (
    <div
      className={`rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4 shadow-2xl shadow-black/20 transition-colors duration-200 hover:bg-white/10 ${className}`}
    >
      {/* Header con icono + título */}
      <div className="flex items-center gap-2 mb-3">
        {Icon && (
          <Icon className="w-4 h-4 text-cyan-400" strokeWidth={1.5} />
        )}
        <h3 className="text-[10px] uppercase tracking-widest text-white/40 font-medium">
          {title}
        </h3>
      </div>

      {/* Contenido: children o value + subtitle */}
      {children ? (
        children
      ) : (
        <>
          <p className="text-2xl font-bold text-white tracking-tight mb-1">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-white/50">{subtitle}</p>
          )}
        </>
      )}
    </div>
  );
}