import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useWeather } from '../context/WeatherContext.jsx';
import { MapSkeleton } from './LoadingSkeleton.jsx';

// Fix Leaflet's default icon path issue with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Helper: auto-pan map when coordinates change
function MapUpdater({ lat, lon }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lon) {
      map.setView([lat, lon], 10, { animate: true });
    }
  }, [lat, lon, map]);
  return null;
}

export default function WeatherMap() {
  const { currentWeather, loading } = useWeather();
  if (loading || !currentWeather) return <MapSkeleton />;

  const { lat, lon, city, country, condition } = currentWeather;
  if (!lat || !lon) return null;

  return (
    <div className="glass-card p-5 animate-fade-in">
      <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">
        📍 Weather Map
      </h2>
      <div className="rounded-xl overflow-hidden" style={{ height: '260px' }}>
        <MapContainer
          center={[lat, lon]}
          zoom={10}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
          aria-label={`Weather map centered on ${city}`}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapUpdater lat={lat} lon={lon} />
          <Marker position={[lat, lon]}>
            <Popup>
              <div className="text-center py-1">
                <p className="font-bold text-slate-800">{city}{country ? `, ${country}` : ''}</p>
                <p className="text-sm text-slate-600">{condition}</p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
