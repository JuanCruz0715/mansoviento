export const StaticBackground = () => {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        background: `
          radial-gradient(ellipse 80% 60% at 80% 0%, rgba(34, 211, 238, 0.15), transparent 60%),
          radial-gradient(ellipse 70% 50% at 20% 100%, rgba(59, 130, 246, 0.10), transparent 60%),
          linear-gradient(180deg, #020617 0%, #0a0f1f 50%, #020617 100%)
        `,
      }}
    >
      {/* Grano sutil */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' /%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};