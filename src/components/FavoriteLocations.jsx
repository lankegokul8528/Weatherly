import React from 'react';
import { Star, Trash2, MapPin } from 'lucide-react';
import { useWeather } from '../context/WeatherContext.jsx';

export default function FavoriteLocations() {
  const { favorites, dispatch, fetchWeatherForCity, currentWeather } = useWeather();

  if (!favorites.length) return null;

  function removeFavorite(city) {
    dispatch({ type: 'REMOVE_FAVORITE', payload: city });
  }

  return (
    <div className="glass-card p-5 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
          Favorite Locations
        </h2>
      </div>
      <div className="space-y-2">
        {favorites.map((fav) => {
          const isActive = currentWeather?.city === fav.city;
          return (
            <div
              key={fav.city}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-200 group
                ${isActive
                  ? 'border-blue-500/40 bg-blue-500/10'
                  : 'border-[var(--border-color)] hover:border-blue-500/30 hover:bg-[var(--border-color)]'
                }`}
            >
              <MapPin className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-blue-400' : 'text-[var(--text-muted)]'}`} />
              <button
                onClick={() => fetchWeatherForCity(fav.city)}
                className="flex-1 text-left"
                aria-label={`Load weather for ${fav.city}`}
              >
                <p className={`text-sm font-medium ${isActive ? 'text-blue-400' : 'text-[var(--text-primary)]'}`}>
                  {fav.city}
                </p>
                {fav.country && (
                  <p className="text-xs text-[var(--text-muted)]">{fav.country}</p>
                )}
              </button>
              <button
                onClick={() => removeFavorite(fav.city)}
                className="opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-red-400 transition-all duration-200 p-1 rounded"
                aria-label={`Remove ${fav.city} from favorites`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
