import React from 'react';
import {
  Droplets, Wind, Compass, Gauge, Eye, Zap, Sunrise, Sunset,
} from 'lucide-react';
import WeatherStatCard from './WeatherStatCard.jsx';
import { useWeather } from '../context/WeatherContext.jsx';
import {
  getWindDirection,
  formatUnixTime,
  getUVLabel,
  getVisibilityLabel,
} from '../utils/weatherUtils.js';

export default function WeatherStats() {
  const { currentWeather } = useWeather();
  if (!currentWeather) return null;

  const {
    humidity, windSpeed, windDeg, pressure, visibility,
    uvIndex, sunrise, sunset, timezone,
  } = currentWeather;

  const uvInfo = getUVLabel(uvIndex);
  const windDir = getWindDirection(windDeg);
  const sunriseStr = sunrise ? formatUnixTime(sunrise, timezone) : '--';
  const sunsetStr = sunset ? formatUnixTime(sunset, timezone) : '--';

  const stats = [
    {
      icon: Droplets,
      iconBg: 'bg-blue-100 dark:bg-blue-900/30 text-blue-500',
      label: 'Humidity',
      value: humidity,
      unit: '%',
      subtext: humidity > 70 ? 'High – feels muggy' : humidity > 40 ? 'Comfortable' : 'Low – dry air',
    },
    {
      icon: Wind,
      iconBg: 'bg-teal-100 dark:bg-teal-900/30 text-teal-500',
      label: 'Wind Speed',
      value: windSpeed,
      unit: ' km/h',
      subtext: windSpeed > 40 ? 'Strong gusts' : windSpeed > 20 ? 'Breezy' : 'Light breeze',
    },
    {
      icon: Compass,
      iconBg: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500',
      label: 'Wind Direction',
      value: windDir,
      unit: '',
      subtext: `${windDeg}° bearing`,
    },
    {
      icon: Gauge,
      iconBg: 'bg-purple-100 dark:bg-purple-900/30 text-purple-500',
      label: 'Pressure',
      value: pressure,
      unit: ' hPa',
      subtext: pressure > 1013 ? 'High pressure' : 'Low pressure',
    },
    {
      icon: Eye,
      iconBg: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-500',
      label: 'Visibility',
      value: visibility,
      unit: ' km',
      subtext: getVisibilityLabel(visibility),
    },
    {
      icon: Zap,
      iconBg: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500',
      label: 'UV Index',
      value: uvIndex,
      unit: '',
      subtext: uvInfo.label,
    },
    {
      icon: Sunrise,
      iconBg: 'bg-orange-100 dark:bg-orange-900/30 text-orange-500',
      label: 'Sunrise',
      value: sunriseStr,
      unit: '',
      subtext: 'Local time',
    },
    {
      icon: Sunset,
      iconBg: 'bg-pink-100 dark:bg-pink-900/30 text-pink-500',
      label: 'Sunset',
      value: sunsetStr,
      unit: '',
      subtext: 'Local time',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <WeatherStatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
