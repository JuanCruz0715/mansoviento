// src/utils/riskUtils.js

/**
 * Calcula el nivel de riesgo global según la lluvia prevista en 24h.
 */
export function nivelGlobalPorLluvia(lluviaMm) {
  if (lluviaMm >= 60) return 'rojo';
  if (lluviaMm >= 30) return 'naranja';
  if (lluviaMm >= 10) return 'amarillo';
  return 'verde';
}

/**
 * Recalcula el nivel de un punto crítico combinando:
 * - su nivel base (alto/medio/bajo)
 * - el nivel global del día
 */
export function nivelPuntoPorLluvia(punto, nivelGlobal) {
  const orden = { bajo: 1, medio: 2, alto: 3, verde: 1, amarillo: 2, naranja: 3, rojo: 4 };

  // Escala: base + 0/1/2 según el global
  const boost =
    nivelGlobal === 'rojo' ? 2 :
    nivelGlobal === 'naranja' ? 2 :
    nivelGlobal === 'amarillo' ? 1 : 0;

  const baseScore = orden[punto.nivelBase] || 2;
  const scoreFinal = Math.min(baseScore + boost, 4);

  if (scoreFinal >= 4) return 'rojo';
  if (scoreFinal === 3) return 'naranja';
  if (scoreFinal === 2) return 'amarillo';
  return 'verde';
}

/**
 * Textos e íconos según el nivel global.
 */
export const textosNivel = {
  verde:    { icono: '✅', texto: 'Sin riesgo significativo hoy' },
  amarillo: { icono: '⚠️', texto: 'Precaución: lluvias moderadas previstas' },
  naranja:  { icono: '🟠', texto: 'Evacuación preventiva en zonas bajas' },
  rojo:     { icono: '🔴', texto: 'PELIGRO INMINENTE — Buscá zonas altas' },
};

/**
 * Clases Tailwind según el nivel (para el semáforo).
 */
export const clasesSemaforo = {
  verde:    'bg-green-100 text-green-800',
  amarillo: 'bg-yellow-100 text-yellow-800',
  naranja:  'bg-orange-100 text-orange-800',
  rojo:     'bg-red-100 text-red-800',
};

/**
 * Colores hex según el nivel (para los círculos del mapa).
 */
export const coloresNivel = {
  verde:    '#10b981',
  amarillo: '#f59e0b',
  naranja:  '#ea580c',
  rojo:     '#dc2626',
};