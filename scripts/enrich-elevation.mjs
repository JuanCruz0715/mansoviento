// scripts/enrich-elevation.mjs
// Script para enriquecer puntosCriticos.json con datos de elevación
// Uso: node scripts/enrich-elevation.mjs
// Solo se corre localmente, NO en producción.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, '../src/data/puntosCriticos.json');

// 1. Leer puntos actuales
console.log('📖 Leyendo puntos críticos...');
const puntos = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
console.log(`   ${puntos.length} puntos encontrados.`);

// 2. Preparar coordenadas para batch (Open-Meteo acepta hasta 100 puntos en una llamada)
const latitudes = puntos.map(p => p.lat).join(',');
const longitudes = puntos.map(p => p.lng).join(',');

const url = `https://api.open-meteo.com/v1/elevation?latitude=${latitudes}&longitude=${longitudes}`;

console.log('\n📡 Consultando API de Open-Meteo...');
console.log(`   URL: ${url}\n`);

const res = await fetch(url);

if (!res.ok) {
  console.error(`❌ Error en la API: ${res.status} ${res.statusText}`);
  const text = await res.text();
  console.error('Respuesta:', text);
  process.exit(1);
}

const data = await res.json();

if (!data.elevation || !Array.isArray(data.elevation)) {
  console.error('❌ Respuesta inesperada:', data);
  process.exit(1);
}

console.log('✅ Respuesta recibida:');
data.elevation.forEach((elev, i) => {
  console.log(`   ${i + 1}. ${puntos[i].nombre}: ${elev} m`);
});

// 3. Fusionar elevaciones con los puntos
const puntosEnriquecidos = puntos.map((p, i) => ({
  ...p,
  elevacion: data.elevation[i] ?? null,
}));

// 4. Guardar
fs.writeFileSync(DATA_PATH, JSON.stringify(puntosEnriquecidos, null, 2));

console.log(`\n💾 Archivo actualizado: ${DATA_PATH}`);
console.log(`✅ ${puntos.length} puntos enriquecidos con elevación.`);
console.log('\n🚀 Ahora recargá /riesgo y hacé click en un círculo para ver el resultado.');