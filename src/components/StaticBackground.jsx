export const StaticBackground = () => {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        background: `
          radial-gradient(ellipse 80% 60% at 50% 0%, rgba(245, 158, 11, 0.05), transparent 50%),
          radial-gradient(ellipse 80% 60% at 80% 100%, rgba(34, 211, 238, 0.03), transparent 50%),
          #050505
        `,
      }}
    >
      {/* Grano sutil para textura */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' /%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};