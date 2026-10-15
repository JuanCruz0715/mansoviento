// src/hooks/useRiskData.js
import { useState, useEffect } from 'react'
import puntosCriticos from '../data/puntosCriticos.json'

export function useRiskData() {
  const [riesgo, setRiesgo] = useState({ nivel: 'verde', lluvia24h: 0, cargando: true })

  useEffect(() => {
    async function calcular() {
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=-31.5375&longitude=-68.5364&hourly=precipitation&forecast_days=2'
        )
        const data = await res.json()
        const lluvia24h = data.hourly.precipitation.slice(0, 24).reduce((a, b) => a + b, 0)

        let nivel = 'verde'
        if (lluvia24h > 10) nivel = 'amarillo'
        if (lluvia24h > 30) nivel = 'naranja'
        if (lluvia24h > 60) nivel = 'rojo'

        setRiesgo({ nivel, lluvia24h, cargando: false })
      } catch (e) {
        setRiesgo({ nivel: 'verde', lluvia24h: 0, cargando: false, error: true })
      }
    }
    calcular()
    const intervalo = setInterval(calcular, 15 * 60 * 1000) // cada 15 min
    return () => clearInterval(intervalo)
  }, [])

  return { ...riesgo, puntosCriticos }
}