// Weather utility helpers

/**
 * Convert Celsius to Fahrenheit
 */
export function celsiusToFahrenheit(c) {
  return Math.round((c * 9) / 5 + 32);
}

/**
 * Format temperature with unit symbol
 */
export function formatTemp(value, unit) {
  if (value === null || value === undefined) return '--';
  const val = unit === 'F' ? celsiusToFahrenheit(value) : Math.round(value);
  return `${val}°${unit}`;
}

/**
 * Get display temperature value (number only)
 */
export function getTempValue(value, unit) {
  if (value === null || value === undefined) return '--';
  return unit === 'F' ? celsiusToFahrenheit(value) : Math.round(value);
}

/**
 * Map OWM condition codes to Tailwind color class and emoji
 */
export function getConditionStyle(code) {
  if (!code) return { emoji: '🌤️', color: 'text-blue-400', gradient: 'from-blue-400 to-blue-600' };
  if (code === 800) return { emoji: '☀️', color: 'text-yellow-400', gradient: 'from-yellow-400 to-orange-500' };
  if (code === 801) return { emoji: '🌤️', color: 'text-blue-300', gradient: 'from-blue-300 to-blue-500' };
  if (code === 802) return { emoji: '⛅', color: 'text-slate-400', gradient: 'from-slate-300 to-slate-500' };
  if (code === 803 || code === 804) return { emoji: '☁️', color: 'text-slate-500', gradient: 'from-slate-400 to-slate-600' };
  if (code >= 200 && code < 300) return { emoji: '⛈️', color: 'text-purple-500', gradient: 'from-purple-500 to-indigo-700' };
  if (code >= 300 && code < 400) return { emoji: '🌦️', color: 'text-blue-400', gradient: 'from-blue-400 to-blue-600' };
  if (code >= 500 && code < 600) return { emoji: '🌧️', color: 'text-blue-500', gradient: 'from-blue-500 to-blue-700' };
  if (code >= 600 && code < 700) return { emoji: '❄️', color: 'text-cyan-300', gradient: 'from-cyan-200 to-blue-400' };
  if (code >= 700 && code < 800) return { emoji: '🌫️', color: 'text-gray-400', gradient: 'from-gray-300 to-gray-500' };
  return { emoji: '🌤️', color: 'text-blue-400', gradient: 'from-blue-400 to-blue-600' };
}

/**
 * Get background gradient class based on condition code and time
 */
export function getWeatherBgGradient(code, isNight = false) {
  if (isNight) return 'from-slate-900 via-blue-950 to-indigo-950';
  if (code === 800) return 'from-amber-400 via-orange-400 to-blue-500';
  if (code >= 800 && code < 805) return 'from-blue-400 via-blue-500 to-slate-500';
  if (code >= 200 && code < 300) return 'from-purple-700 via-indigo-700 to-slate-800';
  if (code >= 500 && code < 600) return 'from-blue-600 via-blue-700 to-indigo-800';
  if (code >= 600 && code < 700) return 'from-cyan-200 via-blue-200 to-slate-300';
  return 'from-blue-500 via-blue-600 to-indigo-700';
}

/**
 * Convert wind degrees to compass direction
 */
export function getWindDirection(degrees) {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(((degrees % 360) / 22.5));
  return dirs[index % 16];
}

/**
 * Format a Unix timestamp to a time string (HH:MM AM/PM)
 */
export function formatUnixTime(unix, timezone = 0) {
  const date = new Date((unix + timezone) * 1000);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 || 12;
  const m = minutes.toString().padStart(2, '0');
  return `${h}:${m} ${ampm}`;
}

/**
 * Format current date/time nicely
 */
export function formatCurrentDateTime() {
  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = days[now.getDay()];
  const date = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 || 12;
  return {
    full: `${day}, ${date} ${month} ${year}`,
    time: `${h}:${minutes} ${ampm}`,
  };
}

/**
 * Generate weather tips based on current conditions
 */
export function getWeatherTips(weather) {
  if (!weather) return [];
  const tips = [];
  const { conditionCode, humidity, windSpeed, uvIndex, temp } = weather;

  if (conditionCode >= 500 && conditionCode < 600) {
    tips.push({
      icon: '☂️',
      title: 'Rain Expected',
      tip: 'Carry an umbrella if you\'re heading outside. Roads may be slippery.',
      color: 'blue',
    });
  }
  if (conditionCode >= 200 && conditionCode < 300) {
    tips.push({
      icon: '⚡',
      title: 'Thunderstorm',
      tip: 'Stay indoors and avoid open areas. Unplug sensitive electronics.',
      color: 'purple',
    });
  }
  if (temp >= 35) {
    tips.push({
      icon: '🌡️',
      title: 'Extreme Heat',
      tip: 'Stay hydrated and avoid prolonged exposure to direct sunlight between 11AM–4PM.',
      color: 'red',
    });
  } else if (temp >= 30) {
    tips.push({
      icon: '💧',
      title: 'Hot Weather',
      tip: 'Stay hydrated. Drink at least 8 glasses of water today.',
      color: 'orange',
    });
  }
  if (uvIndex >= 7) {
    tips.push({
      icon: '🧴',
      title: 'High UV Index',
      tip: `UV level is ${uvIndex} (${uvIndex >= 11 ? 'Extreme' : uvIndex >= 8 ? 'Very High' : 'High'}). Apply SPF 30+ sunscreen and wear protective clothing.`,
      color: 'yellow',
    });
  }
  if (windSpeed >= 20) {
    tips.push({
      icon: '💨',
      title: 'Strong Winds',
      tip: 'Secure lightweight outdoor objects. Be cautious while driving or cycling.',
      color: 'teal',
    });
  }
  if (humidity >= 80) {
    tips.push({
      icon: '🌊',
      title: 'High Humidity',
      tip: 'It may feel more uncomfortable than the temperature suggests. Wear light, breathable clothing.',
      color: 'cyan',
    });
  }
  if (conditionCode >= 600 && conditionCode < 700) {
    tips.push({
      icon: '❄️',
      title: 'Snowy Conditions',
      tip: 'Wear warm layers and waterproof footwear. Drive carefully on icy roads.',
      color: 'blue',
    });
  }
  if (conditionCode === 800 && uvIndex < 5) {
    tips.push({
      icon: '☀️',
      title: 'Great Outdoors Day',
      tip: 'Perfect weather for outdoor activities. Enjoy the sunshine!',
      color: 'green',
    });
  }
  if (tips.length === 0) {
    tips.push({
      icon: '🌤️',
      title: 'Moderate Conditions',
      tip: 'Weather conditions are comfortable today. A light jacket may be useful in the evening.',
      color: 'blue',
    });
  }
  return tips;
}

/**
 * Get UV index label and color
 */
export function getUVLabel(uv) {
  if (uv <= 2) return { label: 'Low', color: 'text-green-500' };
  if (uv <= 5) return { label: 'Moderate', color: 'text-yellow-500' };
  if (uv <= 7) return { label: 'High', color: 'text-orange-500' };
  if (uv <= 10) return { label: 'Very High', color: 'text-red-500' };
  return { label: 'Extreme', color: 'text-purple-500' };
}

/**
 * Get visibility description
 */
export function getVisibilityLabel(km) {
  if (km >= 10) return 'Excellent';
  if (km >= 5) return 'Good';
  if (km >= 2) return 'Moderate';
  if (km >= 1) return 'Poor';
  return 'Very Poor';
}

/**
 * Normalize a city name for matching
 */
export function normalizeCityName(name) {
  return name.trim().toLowerCase().replace(/\s+/g, '');
}

/**
 * Debounce function for search
 */
export function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
