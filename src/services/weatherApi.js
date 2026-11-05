import axios from 'axios';
import {
  mockCurrentWeather,
  mockHourlyForecast,
  mockWeeklyForecast,
  mockAlerts,
  mockCities,
} from './mockData.js';
import { normalizeCityName } from '../utils/weatherUtils.js';

// ✅ Vite env variable syntax (replaces process.env)
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

const hasValidKey = () => typeof API_KEY === 'string' && API_KEY.length > 10;

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
    temp: Math.round(data.main?.temp),
    feelsLike: Math.round(data.main?.feels_like),
    humidity: data.main?.humidity,
    windSpeed: Math.round((data.wind?.speed || 0) * 3.6),
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
  const list = data.list || [];
  const cityTimezoneOffset = data.city?.timezone || 0;

  const hourly = [];
  const currentLocalMs = Date.now() + cityTimezoneOffset * 1000;

  for (let i = 0; i < 12; i++) {
    const targetTimeMs = currentLocalMs + i * 60 * 60 * 1000;
    const dateObj = new Date(targetTimeMs);

    const timeStr = i === 0
      ? 'Now'
      : dateObj.toLocaleTimeString('en-US', {
          hour: 'numeric',
          hour12: true,
          timeZone: 'UTC',
        });

    const item = list[Math.floor(i / 3)] || list[0] || {};
    const tempVal = item.main?.temp !== undefined ? Math.round(item.main.temp) : 0;

    hourly.push({
      time: timeStr,
      temp: tempVal,
      conditionCode: item.weather?.[0]?.id || 800,
      icon: item.weather?.[0]?.icon || '01d',
      rainChance: Math.round((item.pop || 0) * 100),
      condition: item.weather?.[0]?.main || 'Clear',
    });
  }

  const days = {};

  list.forEach((item) => {
    const itemDate = new Date((item.dt + cityTimezoneOffset) * 1000);
    const dayKey = itemDate.toISOString().split('T')[0];

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

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const weekly = Object.values(days)
    .slice(0, 7)
    .map((d, idx) => {
      const [year, month, dayNum] = d.date.split('-').map(Number);
      const localDate = new Date(year, month - 1, dayNum);

      return {
        ...d,
        day: idx === 0 ? 'Today' : dayNames[localDate.getDay()],
        dateDisplay: `${monthNames[localDate.getMonth()]} ${localDate.getDate()}`,
        high: Math.round(d.high),
        low: Math.round(d.low),
        tempMax: Math.round(d.high),
        tempMin: Math.round(d.low),
      };
    });

  return { hourly, weekly };
}

/* ============================================================
   Mock Fallback Helpers
   ============================================================ */
function getMockForCity(cityQuery) {
  const key = normalizeCityName(cityQuery || '');
  if (key.includes('vijayawada') || key.includes('india')) return mockCurrentWeather;
  if (key.includes('london')) return mockCities.london;
  if (key.includes('newyork') || key.includes('new york') || key.includes('nyc')) return mockCities.newyork;
  if (key.includes('tokyo')) return mockCities.tokyo;

  return {
    ...mockCurrentWeather,
    city: (cityQuery || 'Vijayawada').split(',')[0].trim(),
    country: 'IN',
  };
}

/* ============================================================
   Public API Exports
   ============================================================ */
export async function getCurrentWeather(city) {
  if (!hasValidKey()) {
    await new Promise((r) => setTimeout(r, 300));
    return getMockForCity(city);
  }
  try {
    const { data } = await axios.get(`${BASE_URL}/weather`, {
      params: { q: city, appid: API_KEY, units: 'metric' },
    });
    return normalizeCurrentWeather(data);
  } catch (err) {
    if (err.response?.status === 404) {
      throw new Error('City not found');
    }
    return getMockForCity(city);
  }
}

export async function getWeatherByCoordinates(lat, lon) {
  if (!hasValidKey()) {
    await new Promise((r) => setTimeout(r, 300));
    return { ...mockCurrentWeather, lat, lon };
  }
  try {
    const { data } = await axios.get(`${BASE_URL}/weather`, {
      params: { lat, lon, appid: API_KEY, units: 'metric' },
    });
    return normalizeCurrentWeather(data);
  } catch {
    return { ...mockCurrentWeather, lat, lon };
  }
}

export async function getForecast(city) {
  if (!hasValidKey()) {
    await new Promise((r) => setTimeout(r, 300));
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

export async function getForecastByCoordinates(lat, lon) {
  if (!hasValidKey()) {
    await new Promise((r) => setTimeout(r, 300));
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

export async function getWeatherAlerts(lat, lon) {
  if (!hasValidKey()) return mockAlerts;
  try {
    const { data } = await axios.get(`${BASE_URL}/onecall`, {
      params: { lat, lon, appid: API_KEY, exclude: 'current,minutely,hourly,daily' },
    });
    return data.alerts || [];
  } catch {
    return mockAlerts;
  }
}

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
      display: item.state ? `${item.name}, ${item.state}, ${item.country}` : `${item.name}, ${item.country}`,
    }));
  } catch {
    return [];
  }
}