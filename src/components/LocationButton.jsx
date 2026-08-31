import React, { useState } from 'react';
import { Navigation, Loader2, AlertCircle } from 'lucide-react';
import { useWeather } from '../context/WeatherContext.jsx';

export default function LocationButton() {
  const { fetchWeatherByCoords } = useWeather();
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState(null);

  function handleGetLocation() {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }
    setGeoLoading(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          await fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
        } finally {
          setGeoLoading(false);
        }
      },
      (err) => {
        setGeoLoading(false);
        if (err.code === 1) {
          setGeoError('Location permission denied.');
        } else {
          setGeoError('Unable to determine location.');
        }
        setTimeout(() => setGeoError(null), 4000);
      },
      { timeout: 10000 }
    );
  }

  return (
    <div className="relative">
      <button
        onClick={handleGetLocation}
        disabled={geoLoading}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl
          bg-[var(--glass-bg)] border border-[var(--border-color)]
          hover:border-blue-500 hover:text-blue-400
          text-[var(--text-secondary)] text-sm font-medium
          transition-all duration-200 hover:scale-105 active:scale-95
          disabled:opacity-60 disabled:cursor-not-allowed backdrop-blur-md"
        aria-label="Use my current location"
        title="Use my current location"
      >
        {geoLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Navigation className="w-4 h-4" />
        )}
        <span className="hidden sm:inline">{geoLoading ? 'Locating…' : 'My Location'}</span>
      </button>

      {/* Error tooltip */}
      {geoError && (
        <div className="absolute top-full mt-2 right-0 glass-card px-3 py-2 text-xs text-red-400 flex items-center gap-1.5 whitespace-nowrap z-50 animate-fade-in">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {geoError}
        </div>
      )}
    </div>
  );
}
