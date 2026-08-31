import axios from 'axios';
import {
  mockCurrentWeather,
  mockHourlyForecast,
  mockWeeklyForecast,
  mockAlerts,
  mockCities,
} from './mockData.js';
import { normalizeCityName } from '../utils/weatherUtils.js';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

const hasValidKey = () => API_KEY && API_KEY.length > 10;

/* ============================================================
   OWM Response Normalizers
   ============================================================ */
function normalizeCurrentWeather(data) {
  return {
    city: data.name,
    country: data.sys?.country || '',
    countryName: '',
    lat: data.coord?.lat,
    lon: data.coord?.lon,
    temp: data.main?.temp,
    feelsLike: data.main?.feels_like,
    humidity: data.main?.humidity,
    windSpeed: Math.round((data.wind?.speed || 0) * 3.6), // m/s -> km/h
    windDeg: data.wind?.deg || 0,
    pressure: data.main?.pressure,
    visibility: data.visibility ? Math.round(data.visibility / 1000) : 10,
    uvIndex: data.uvi || 0,
    sunrise: data.sys?.sunrise,
    sunset: data.sys?.sunset,
    condition: data.weather?.[0]?.main || 'Clear',
    conditionCode: data.weather?.[0]?.id || 800,
    icon: data.weather?.[0]?.icon || '01d',
    description: data.weather?.[0]?.description || 'clear sky',
    timezone: data.timezone || 0,
  };
}

function normalizeForecast(data) {
  // Group forecast list into days
  const days = {};
  const hourly = [];

  data.list.forEach((item, idx) => {
    const date = new Date(item.dt * 1000);
    const dayKey = date.toISOString().split('T')[0];
    const hour = date.getUTCHours() + Math.floor(data.city.timezone / 3600);
    const adjustedHour = ((hour % 24) + 24) % 24;
    const ampm = adjustedHour >= 12 ? 'PM' : 'AM';
    const h = adjustedHour % 12 || 12;
    const timeStr = `${h.toString().padStart(2, '0')} ${ampm}`;

    // Hourly – first 12 entries
    if (idx < 12) {
      hourly.push({
        time: timeStr,
        temp: Math.round(item.main.temp),
        conditionCode: item.weather[0].id,
        icon: item.weather[0].icon,
        rainChance: Math.round((item.pop || 0) * 100),
        condition: item.weather[0].main,
      });
    }

    // Daily grouping
    if (!days[dayKey]) {
      days[dayKey] = {
        date: dayKey,
        high: item.main.temp_max,
        low: item.main.temp_min,
        conditionCode: item.weather[0].id,
        icon: item.weather[0].icon,
        condition: item.weather[0].main,
        rainChance: Math.round((item.pop || 0) * 100),
      };
    } else {
      if (item.main.temp_max > days[dayKey].high) days[dayKey].high = item.main.temp_max;
      if (item.main.temp_min < days[dayKey].low) days[dayKey].low = item.main.temp_min;
      if ((item.pop || 0) * 100 > days[dayKey].rainChance) {
        days[dayKey].rainChance = Math.round((item.pop || 0) * 100);
      }
    }
  });

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const weekly = Object.values(days)
    .slice(0, 7)
    .map((d, idx) => {
      const dateObj = new Date(d.date);
      return {
        ...d,
        day: idx === 0 ? 'Today' : dayNames[dateObj.getDay()],
        dateDisplay: `${monthNames[dateObj.getMonth()]} ${dateObj.getDate()}`,
        high: Math.round(d.high),
        low: Math.round(d.low),
      };
    });

  return { hourly, weekly };
}

/* ============================================================
   Mock Fallback Helpers
   ============================================================ */
function getMockForCity(cityQuery) {
  const key = normalizeCityName(cityQuery);
  if (key.includes('vijayawada') || key.includes('india')) return mockCurrentWeather;
  if (key.includes('london')) return mockCities.london;
  if (key.includes('newyork') || key.includes('new york') || key.includes('nyc')) return mockCities.newyork;
  if (key.includes('tokyo')) return mockCities.tokyo;

  // Generic mock with custom city name
  return {
    ...mockCurrentWeather,
    city: cityQuery.split(',')[0].trim(),
    country: 'US',
    lat: 40.7128 + (Math.random() - 0.5) * 10,
    lon: -74.0060 + (Math.random() - 0.5) * 10,
  };
}

/* ============================================================
   Public API Functions
   ============================================================ */

/**
 * Get current weather by city name
 */
export async function getCurrentWeather(city) {
  if (!hasValidKey()) {
    await new Promise((r) => setTimeout(r, 600)); // simulate network
    return getMockForCity(city);
  }
  try {
    const { data } = await axios.get(`${BASE_URL}/weather`, {
      params: { q: city, appid: API_KEY, units: 'metric' },
    });
    return normalizeCurrentWeather(data);
  } catch (err) {
    // 404 = city not found – surface to user
    if (err.response?.status === 404) {
      throw new Error('City not found');
    }
    // 401 = key not yet active / invalid → silently use mock data
    console.warn('[Weatherly] API unavailable, using mock data:', err.message);
    return getMockForCity(city);
  }
}

/**
 * Get current weather by geographic coordinates
 */
export async function getWeatherByCoordinates(lat, lon) {
  if (!hasValidKey()) {
    await new Promise((r) => setTimeout(r, 600));
    return { ...mockCurrentWeather, lat, lon };
  }
  try {
    const { data } = await axios.get(`${BASE_URL}/weather`, {
      params: { lat, lon, appid: API_KEY, units: 'metric' },
    });
    return normalizeCurrentWeather(data);
  } catch (err) {
    console.warn('[Weatherly] Coords API unavailable, using mock data:', err.message);
    return { ...mockCurrentWeather, lat, lon };
  }
}

/**
 * Get 5-day / 3-hour forecast by city
 * Returns { hourly, weekly }
 */
export async function getForecast(city) {
  if (!hasValidKey()) {
    await new Promise((r) => setTimeout(r, 700));
    return { hourly: mockHourlyForecast, weekly: mockWeeklyForecast };
  }
  try {
    const { data } = await axios.get(`${BASE_URL}/forecast`, {
      params: { q: city, appid: API_KEY, units: 'metric', cnt: 40 },
    });
    return normalizeForecast(data);
  } catch {
    return { hourly: mockHourlyForecast, weekly: mockWeeklyForecast };
  }
}

/**
 * Get forecast by coordinates
 */
export async function getForecastByCoordinates(lat, lon) {
  if (!hasValidKey()) {
    await new Promise((r) => setTimeout(r, 700));
    return { hourly: mockHourlyForecast, weekly: mockWeeklyForecast };
  }
  try {
    const { data } = await axios.get(`${BASE_URL}/forecast`, {
      params: { lat, lon, appid: API_KEY, units: 'metric', cnt: 40 },
    });
    return normalizeForecast(data);
  } catch {
    return { hourly: mockHourlyForecast, weekly: mockWeeklyForecast };
  }
}

/**
 * Get weather alerts (OWM One Call API – requires subscription)
 * Falls back to mock alerts
 */
export async function getWeatherAlerts(lat, lon) {
  if (!hasValidKey()) {
    return mockAlerts;
  }
  try {
    const { data } = await axios.get(`${BASE_URL}/onecall`, {
      params: {
        lat, lon, appid: API_KEY,
        exclude: 'current,minutely,hourly,daily',
      },
    });
    return data.alerts || [];
  } catch {
    return mockAlerts;
  }
}

/**
 * Search city suggestions via Geocoding API
 */
export async function searchLocation(query) {
  if (!hasValidKey() || !query) return [];
  try {
    const { data } = await axios.get(`${GEO_URL}/direct`, {
      params: { q: query, limit: 5, appid: API_KEY },
    });
    return data.map((item) => ({
      name: item.name,
      country: item.country,
      state: item.state,
      lat: item.lat,
      lon: item.lon,
      display: item.state
        ? `${item.name}, ${item.state}, ${item.country}`
        : `${item.name}, ${item.country}`,
    }));
  } catch {
    return [];
  }
}
