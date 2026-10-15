// Distancia en metros entre dos coordenadas (fórmula de Haversine)
export function distanciaMetros(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Radio de la Tierra en metros
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Devuelve los puntos críticos dentro de los que cae el usuario
export function puntosCercanos(userLat, userLng, puntos) {
  return puntos.filter((p) => {
    const dist = distanciaMetros(userLat, userLng, p.lat, p.lng);
    return dist <= p.radioMetros;
  });
}