import React from 'react';
import { useWeather } from '../context/WeatherContext.jsx';
import CurrentWeather from '../components/CurrentWeather.jsx';
import WeatherStats from '../components/WeatherStats.jsx';
import HourlyForecast from '../components/HourlyForecast.jsx';
import TemperatureChart from '../components/TemperatureChart.jsx';
import WeeklyForecast from '../components/WeeklyForecast.jsx';
import WeatherAlert from '../components/WeatherAlert.jsx';
import WeatherMap from '../components/WeatherMap.jsx';
import WeatherTips from '../components/WeatherTips.jsx';
import FavoriteLocations from '../components/FavoriteLocations.jsx';
import RecentSearches from '../components/RecentSearches.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import {
  CurrentWeatherSkeleton,
  WeatherStatsSkeleton,
  HourlyForecastSkeleton,
  ChartSkeleton,
  WeeklyForecastSkeleton,
  GenericCardSkeleton,
} from '../components/LoadingSkeleton.jsx';

export default function Dashboard() {
  const { loading, error, currentWeather, fetchWeatherForCity, recentSearches } = useWeather();

  // Error state
  if (error && !currentWeather) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage
          message={error}
          onRetry={() => fetchWeatherForCity(recentSearches[0] || 'Vijayawada')}
        />
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

      {/* === Alerts (full width, above fold if any) === */}
      {!loading && <WeatherAlert />}

      {/* === TOP: Main weather + sidebar === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main left column (2/3 width on large screens) */}
        <div className="lg:col-span-2 space-y-5">
          {/* Current Weather Hero */}
          {loading ? <CurrentWeatherSkeleton /> : <CurrentWeather />}

          {/* Weather Statistics */}
          {loading ? <WeatherStatsSkeleton /> : <WeatherStats />}

          {/* Hourly Forecast */}
          {loading ? <HourlyForecastSkeleton /> : <HourlyForecast />}

          {/* Temperature Chart */}
          {loading ? <ChartSkeleton /> : <TemperatureChart />}
        </div>

        {/* Right sidebar (1/3 width) */}
        <div className="space-y-5">
          {/* 7-Day Forecast */}
          {loading ? <WeeklyForecastSkeleton /> : <WeeklyForecast />}

          {/* Favorite Locations */}
          {loading ? <GenericCardSkeleton lines={4} /> : <FavoriteLocations />}

          {/* Recent Searches */}
          {!loading && <RecentSearches />}
        </div>
      </div>

      {/* === BOTTOM: Map + Tips (full width) === */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeatherMap />
        {loading ? <GenericCardSkeleton lines={5} /> : <WeatherTips />}
      </div>

      {/* Error banner (non-blocking, data still shown) */}
      {error && currentWeather && (
        <div className="glass-card p-4 border border-amber-500/30 bg-amber-500/10 flex items-center gap-3 animate-fade-in">
          <span className="text-amber-500 text-lg">⚠️</span>
          <p className="text-sm text-amber-600 dark:text-amber-400">
            {error} — showing previously loaded data.
          </p>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center text-xs text-[var(--text-muted)] py-4">
        Weatherly © {new Date().getFullYear()} · Powered by OpenWeatherMap · Map by OpenStreetMap
      </footer>
    </main>
  );
}
