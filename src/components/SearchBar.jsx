import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useWeather } from '../context/WeatherContext.jsx';

export default function SearchBar({ onClose }) {
  const { fetchWeatherForCity, loading, recentSearches } = useWeather();
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
    if (onClose) onClose();
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSearch(query);
    if (e.key === 'Escape' && onClose) onClose();
  }

  const showSuggestions = isFocused && recentSearches.length > 0 && !query;

  return (
    <div className="relative w-full max-w-md">
      {/* Input wrapper */}
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
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          placeholder="Search city..."
          className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none min-w-0"
          aria-label="Search for a city"
          id="city-search-input"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {query && (
          <button
            onClick={() => handleSearch(query)}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 flex-shrink-0"
            aria-label="Search"
          >
            Go
          </button>
        )}
      </div>

      {/* Recent searches dropdown */}
      {showSuggestions && (
        <div className="absolute top-full mt-2 left-0 right-0 glass-card py-1 z-50 animate-slide-up overflow-hidden">
          <p className="text-xs text-[var(--text-muted)] px-3 py-1.5 font-medium uppercase tracking-wider">
            Recent Searches
          </p>
          {recentSearches.map((city) => (
            <button
              key={city}
              onMouseDown={() => handleSearch(city)}
              className="w-full text-left px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--border-color)] transition-colors flex items-center gap-2"
            >
              <Search className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              {city}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
