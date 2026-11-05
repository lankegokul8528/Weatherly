import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2, Trash2 } from 'lucide-react';
import { useWeather } from '../context/WeatherContext.jsx';

export default function SearchBar({ onClose }) {
  const context = useWeather() || {};
  const fetchWeatherForCity = context.fetchWeatherForCity || (() => {});
  const loading = context.loading || false;
  const recentSearches = context.recentSearches || [];
  const removeRecentSearch = context.removeRecentSearch;
  const clearRecentSearches = context.clearRecentSearches;

  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  function handleSearch(city) {
    if (!city?.trim()) return;
    fetchWeatherForCity(city.trim());
    setQuery('');
    setIsFocused(false);
    if (onClose) onClose();
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(query);
    }
    if (e.key === 'Escape' && onClose) {
      onClose();
    }
  }

  const showSuggestions = isFocused && recentSearches.length > 0 && !query;

  return (
    <div className="relative w-full max-w-md">
      <div
        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border transition-all duration-200
          bg-[var(--glass-bg)] backdrop-blur-md
          ${isFocused
            ? 'border-blue-500 shadow-[0_0_0_3px_rgba(59,130,246,0.15)]'
            : 'border-[var(--border-color)]'
          }`}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 text-blue-400 animate-spin flex-shrink-0" />
        ) : (
          <Search className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
        )}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Search city..."
          className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none min-w-0"
          aria-label="Search for a city"
          id="city-search-input"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1"
            aria-label="Clear input text"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {query && (
          <button
            type="button"
            onClick={() => handleSearch(query)}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 flex-shrink-0"
            aria-label="Search city"
          >
            Go
          </button>
        )}
      </div>

      {showSuggestions && (
        <div className="absolute top-full mt-2 left-0 right-0 glass-card py-1 z-50 animate-slide-up overflow-hidden rounded-2xl border border-[var(--border-color)]">
          <div className="px-3 py-1.5 border-b border-[var(--border-color)]">
            <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">
              Recent Searches
            </p>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {recentSearches.map((city) => (
              <div
                key={city}
                className="w-full px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--border-color)]/50 transition-colors flex items-center justify-between group"
              >
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSearch(city);
                  }}
                  className="flex items-center gap-2 flex-1 text-left cursor-pointer min-w-0"
                >
                  <Search className="w-3.5 h-3.5 text-[var(--text-muted)] flex-shrink-0" />
                  <span className="truncate">{city}</span>
                </button>

                {removeRecentSearch && (
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeRecentSearch(city);
                    }}
                    className="p-1 ml-2 text-[var(--text-muted)] hover:text-red-400 transition-colors rounded-md hover:bg-[var(--glass-bg)] flex-shrink-0"
                    title={`Remove ${city}`}
                    aria-label={`Remove ${city}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {clearRecentSearches && (
            <div className="border-t border-[var(--border-color)] pt-1 mt-1 px-2 pb-1">
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  clearRecentSearches();
                }}
                className="w-full flex items-center justify-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-red-400 hover:bg-[var(--border-color)] py-1.5 rounded-lg transition-colors font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All History</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}