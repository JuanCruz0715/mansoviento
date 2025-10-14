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
      className={`bg-white/30 rounded-2xl p-4 shadow-lg border border-white/40 
        transition-all duration-300 hover:bg-white/40 ${className}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-5 h-5 text-white" />
        <h3 className="text-base font-semibold text-white">{title}</h3>
      </div>

      {children ? (
        children
      ) : (
        <>
          <p className="text-2xl font-bold text-white mb-1">{value}</p>
          {subtitle && <p className="text-xs text-white/80">{subtitle}</p>}
        </>
      )}
    </div>
  );
}