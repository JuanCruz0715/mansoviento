import { useEffect, useState } from 'react';
import { useMap, TileLayer } from 'react-leaflet';

export default function RainRadarLayer({ opacity = 0.6 }) {
  const map = useMap();
  const [radarPath, setRadarPath] = useState(null);

  useEffect(() => {
    // Fetch a RainViewer para obtener el último frame de radar
    fetch('https://api.rainviewer.com/public/weather-maps.json')
      .then((res) => res.json())
      .then((data) => {
        // Tomamos el último frame disponible (el más reciente)
        const pastFrames = data.radar?.past || [];
        const latestFrame = pastFrames[pastFrames.length - 1];

        if (latestFrame) {
          setRadarPath(`${data.host}${latestFrame.path}`);
        }
      })
      .catch((err) => console.error('Error cargando radar:', err));
  }, []);

  if (!radarPath) return null;

  return (
    <TileLayer
      url={`${radarPath}/256/{z}/{x}/{y}/2/1_1.png`}
      opacity={opacity}
      zIndex={100}
      attribution='Radar: <a href="https://www.rainviewer.com/">RainViewer</a>'
    />
  );
}