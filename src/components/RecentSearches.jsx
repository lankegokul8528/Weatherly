import React from 'react';
import { Clock, X, Trash2 } from 'lucide-react';
import { useWeather } from '../context/WeatherContext.jsx';

export default function RecentSearches() {
  const { recentSearches, fetchWeatherForCity, removeRecentSearch, clearRecentSearches } = useWeather();

  if (!recentSearches || recentSearches.length === 0) return null;

  return (
    <div className="glass-card p-5 animate-fade-in rounded-3xl border border-[var(--border-color)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
            Recent Searches
          </h2>
        </div>
        {clearRecentSearches && (
          <button
            onClick={() => clearRecentSearches()}
            className="flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-red-400 transition-colors font-medium"
            aria-label="Clear all recent searches"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear all</span>
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {recentSearches.map((city) => (
          <div
            key={city}
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm
              bg-[var(--border-color)]/60 hover:bg-blue-500/15 hover:border-blue-500/40
              border border-transparent text-[var(--text-secondary)] hover:text-blue-400
              transition-all duration-200"
          >
            <button
              onClick={() => fetchWeatherForCity(city)}
              className="flex items-center gap-1.5 flex-1 text-left"
              aria-label={`Search for ${city}`}
            >
              <Clock className="w-3 h-3 text-[var(--text-muted)] group-hover:text-blue-400 transition-colors" />
              <span>{city}</span>
            </button>

            {removeRecentSearch && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeRecentSearch(city);
                }}
                className="p-0.5 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors ml-1"
                aria-label={`Remove ${city}`}
                title={`Remove ${city}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}