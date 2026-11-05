import React, { createContext, useContext, useReducer, useEffect } from 'react';
import {
  getCurrentWeather,
  getForecast,
  getWeatherByCoordinates,
  getForecastByCoordinates,
  getWeatherAlerts,
} from '../services/weatherApi.js';

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

function createSyncedWeeklyForecast(current, rawWeekly = []) {
  if (!current || !rawWeekly.length) return rawWeekly;
  const currentTemp = current.temp ?? current.main?.temp ?? 0;

  return rawWeekly.map((day, idx) => {
    if (idx === 0 || day.day === 'Today') {
      const existingHigh = day.high ?? day.tempMax ?? currentTemp;
      const existingLow = day.low ?? day.tempMin ?? currentTemp;
      const syncedHigh = Math.max(existingHigh, currentTemp);
      const syncedLow = Math.min(existingLow, currentTemp);

      return {
        ...day,
        day: 'Today',
        high: syncedHigh,
        low: syncedLow,
        tempMax: syncedHigh,
        tempMin: syncedLow,
        condition: current.condition || day.condition,
        conditionCode: current.conditionCode || day.conditionCode,
        icon: current.icon || day.icon,
      };
    }
    return day;
  });
}

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
      if (!action.payload) return state;
      const filtered = state.recentSearches.filter((r) => r.toLowerCase() !== action.payload.toLowerCase());
      const updated = [action.payload, ...filtered].slice(0, 5);
      localStorage.setItem('weatherRecent', JSON.stringify(updated));
      return { ...state, recentSearches: updated };
    }
    case 'REMOVE_RECENT': {
      const updated = state.recentSearches.filter((city) => city.toLowerCase() !== action.payload.toLowerCase());
      localStorage.setItem('weatherRecent', JSON.stringify(updated));
      return { ...state, recentSearches: updated };
    }
    case 'CLEAR_RECENT': {
      localStorage.setItem('weatherRecent', JSON.stringify([]));
      return { ...state, recentSearches: [] };
    }
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    default:
      return state;
  }
}

const WeatherContext = createContext(null);

export function WeatherProvider({ children }) {
  const [state, dispatch] = useReducer(weatherReducer, initialState);

  useEffect(() => {
    const root = document.documentElement;
    if (state.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [state.theme]);

  async function fetchWeatherForCity(city) {
    if (!city?.trim()) return;
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const [current, forecast] = await Promise.all([
        getCurrentWeather(city),
        getForecast(city),
      ]);
      const alertsWithCoords = await getWeatherAlerts(current.lat, current.lon);
      const syncedWeekly = createSyncedWeeklyForecast(current, forecast.weekly);

      dispatch({
        type: 'SET_WEATHER',
        payload: {
          current,
          hourly: forecast.hourly,
          weekly: syncedWeekly,
          alerts: alertsWithCoords,
        },
      });
      dispatch({ type: 'ADD_RECENT', payload: current.city || city });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }

  async function fetchWeatherByCoords(lat, lon) {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const [current, alerts] = await Promise.all([
        getWeatherByCoordinates(lat, lon),
        getWeatherAlerts(lat, lon),
      ]);
      const forecastData = await getForecastByCoordinates(lat, lon);
      const syncedWeekly = createSyncedWeeklyForecast(current, forecastData.weekly);

      dispatch({
        type: 'SET_WEATHER',
        payload: {
          current,
          hourly: forecastData.hourly,
          weekly: syncedWeekly,
          alerts,
        },
      });
      dispatch({ type: 'ADD_RECENT', payload: current.city });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }

  useEffect(() => {
    const lastCity = state.recentSearches[0] || 'Vijayawada';
    fetchWeatherForCity(lastCity);
  }, []);

  const value = {
    ...state,
    dispatch,
    fetchWeatherForCity,
    fetchWeatherByCoords,
    removeRecentSearch(city) {
      dispatch({ type: 'REMOVE_RECENT', payload: city });
    },
    clearRecentSearches() {
      dispatch({ type: 'CLEAR_RECENT' });
    },
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