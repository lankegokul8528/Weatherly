import React from 'react';
import { Clock, X } from 'lucide-react';
import { useWeather } from '../context/WeatherContext.jsx';

export default function RecentSearches() {
  const { recentSearches, fetchWeatherForCity, dispatch } = useWeather();

  if (!recentSearches.length) return null;

  function clearAll() {
    localStorage.removeItem('weatherRecent');
    dispatch({ type: 'ADD_RECENT', payload: null }); // won't add null; resets via reducer
    // Direct clear
    localStorage.setItem('weatherRecent', '[]');
    window.location.reload();
  }

  return (
    <div className="glass-card p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[var(--text-muted)]" />
          <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
            Recent Searches
          </h2>
        </div>
        <button
          onClick={clearAll}
          className="text-xs text-[var(--text-muted)] hover:text-red-400 transition-colors"
          aria-label="Clear recent searches"
        >
          Clear all
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {recentSearches.map((city) => (
          <button
            key={city}
            onClick={() => fetchWeatherForCity(city)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm
              bg-[var(--border-color)] hover:bg-blue-500/20 hover:border-blue-500/40
              border border-transparent
              text-[var(--text-secondary)] hover:text-blue-400
              transition-all duration-200 hover:scale-105 active:scale-95"
            aria-label={`Search for ${city}`}
          >
            <Clock className="w-3 h-3" />
            {city}
          </button>
        ))}
      </div>
    </div>
  );
}
