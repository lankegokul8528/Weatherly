import React, { createContext, useContext, useReducer, useEffect } from 'react';
import {
  getCurrentWeather,
  getForecast,
  getWeatherByCoordinates,
  getForecastByCoordinates,
  getWeatherAlerts,
} from '../services/weatherApi.js';

/* ============================================================
   Initial State
   ============================================================ */
const initialState = {
  currentWeather: null,
  hourlyForecast: [],
  weeklyForecast: [],
  alerts: [],
  loading: false,
  error: null,
  unit: localStorage.getItem('weatherUnit') || 'C',
  theme: localStorage.getItem('weatherTheme') || 'dark',
  favorites: JSON.parse(localStorage.getItem('weatherFavorites') || '[]'),
  recentSearches: JSON.parse(localStorage.getItem('weatherRecent') || '[]'),
  searchQuery: '',
};

/* ============================================================
   Reducer
   ============================================================ */
function weatherReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_WEATHER':
      return {
        ...state,
        currentWeather: action.payload.current,
        hourlyForecast: action.payload.hourly,
        weeklyForecast: action.payload.weekly,
        alerts: action.payload.alerts || [],
        loading: false,
        error: null,
      };
    case 'SET_UNIT':
      localStorage.setItem('weatherUnit', action.payload);
      return { ...state, unit: action.payload };
    case 'TOGGLE_THEME': {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('weatherTheme', newTheme);
      return { ...state, theme: newTheme };
    }
    case 'ADD_FAVORITE': {
      const exists = state.favorites.find((f) => f.city === action.payload.city);
      if (exists) return state;
      const updated = [...state.favorites, action.payload];
      localStorage.setItem('weatherFavorites', JSON.stringify(updated));
      return { ...state, favorites: updated };
    }
    case 'REMOVE_FAVORITE': {
      const updated = state.favorites.filter((f) => f.city !== action.payload);
      localStorage.setItem('weatherFavorites', JSON.stringify(updated));
      return { ...state, favorites: updated };
    }
    case 'ADD_RECENT': {
      const filtered = state.recentSearches.filter((r) => r !== action.payload);
      const updated = [action.payload, ...filtered].slice(0, 5);
      localStorage.setItem('weatherRecent', JSON.stringify(updated));
      return { ...state, recentSearches: updated };
    }
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    default:
      return state;
  }
}

/* ============================================================
   Context
   ============================================================ */
const WeatherContext = createContext(null);

export function WeatherProvider({ children }) {
  const [state, dispatch] = useReducer(weatherReducer, initialState);

  // Apply theme to <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (state.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [state.theme]);

  /**
   * Fetch weather data for a city name
   */
  async function fetchWeatherForCity(city) {
    if (!city?.trim()) return;
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const [current, forecast, alerts] = await Promise.all([
        getCurrentWeather(city),
        getForecast(city),
        getWeatherAlerts(0, 0), // alerts need lat/lon from current
      ]);
      // Re-fetch alerts with actual coordinates
      const alertsWithCoords = await getWeatherAlerts(current.lat, current.lon);
      dispatch({
        type: 'SET_WEATHER',
        payload: {
          current,
          hourly: forecast.hourly,
          weekly: forecast.weekly,
          alerts: alertsWithCoords,
        },
      });
      dispatch({ type: 'ADD_RECENT', payload: city });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }

  /**
   * Fetch weather by coordinates (geolocation)
   */
  async function fetchWeatherByCoords(lat, lon) {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const [current, forecast, alerts] = await Promise.all([
        getWeatherByCoordinates(lat, lon),
        getForecastByCoordinates(lat, lon),
        getWeatherAlerts(lat, lon),
      ]);
      dispatch({
        type: 'SET_WEATHER',
        payload: {
          current,
          hourly: forecast.hourly,
          weekly: forecast.weekly,
          alerts,
        },
      });
      dispatch({ type: 'ADD_RECENT', payload: current.city });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }

  /**
   * Load default city on mount
   */
  useEffect(() => {
    const lastCity = state.recentSearches[0] || 'Vijayawada';
    fetchWeatherForCity(lastCity);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const value = {
    ...state,
    dispatch,
    fetchWeatherForCity,
    fetchWeatherByCoords,
    toggleFavorite(weather) {
      const isFav = state.favorites.some((f) => f.city === weather.city);
      if (isFav) {
        dispatch({ type: 'REMOVE_FAVORITE', payload: weather.city });
      } else {
        dispatch({
          type: 'ADD_FAVORITE',
          payload: { city: weather.city, country: weather.country, lat: weather.lat, lon: weather.lon },
        });
      }
    },
    isFavorite(city) {
      return state.favorites.some((f) => f.city === city);
    },
    setUnit(unit) {
      dispatch({ type: 'SET_UNIT', payload: unit });
    },
    toggleTheme() {
      dispatch({ type: 'TOGGLE_THEME' });
    },
  };

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
}

export function useWeather() {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error('useWeather must be used within WeatherProvider');
  return ctx;
}
