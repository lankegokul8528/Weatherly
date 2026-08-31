import React, { useState, useEffect } from 'react';
import { MapPin, Heart, Calendar, Clock, Star } from 'lucide-react';
import { useWeather } from '../context/WeatherContext.jsx';
import {
  formatTemp,
  getTempValue,
  getConditionStyle,
  getWeatherBgGradient,
  formatCurrentDateTime,
} from '../utils/weatherUtils.js';

export default function CurrentWeather() {
  const { currentWeather, unit, toggleFavorite, isFavorite } = useWeather();
  const [dateTime, setDateTime] = useState(formatCurrentDateTime());

  // Update clock every minute
  useEffect(() => {
    const interval = setInterval(() => setDateTime(formatCurrentDateTime()), 60000);
    return () => clearInterval(interval);
  }, []);

  if (!currentWeather) return null;

  const {
    city, country, temp, feelsLike, condition, conditionCode, description, humidity, windSpeed,
  } = currentWeather;

  const condStyle = getConditionStyle(conditionCode);
  const isNight = new Date().getHours() >= 20 || new Date().getHours() < 6;
  const gradientClass = getWeatherBgGradient(conditionCode, isNight);
  const fav = isFavorite(city);

  return (
    <div className={`relative overflow-hidden rounded-2xl p-6 md:p-8 text-white shadow-2xl animate-fade-in bg-gradient-to-br ${gradientClass}`}>
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left – location + temp */}
        <div className="space-y-3 animate-slide-up">
          {/* Location */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 opacity-80" />
            <span className="text-lg font-semibold opacity-90">
              {city}{country ? `, ${country}` : ''}
            </span>
            <button
              onClick={() => toggleFavorite(currentWeather)}
              className={`ml-1 p-1 rounded-full transition-all duration-200 hover:scale-110 active:scale-95
                ${fav ? 'text-yellow-300' : 'text-white/60 hover:text-yellow-300'}`}
              aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
              title={fav ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star className="w-4 h-4" fill={fav ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Date & Time */}
          <div className="flex items-center gap-4 text-sm opacity-75">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {dateTime.full}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {dateTime.time}
            </span>
          </div>

          {/* Temperature */}
          <div className="flex items-end gap-4">
            <span className="text-7xl md:text-8xl font-black tracking-tight leading-none">
              {getTempValue(temp, unit)}
            </span>
            <div className="pb-2 space-y-1">
              <span className="text-3xl font-light opacity-80">°{unit}</span>
            </div>
          </div>

          {/* Condition + Feels like */}
          <div className="space-y-1">
            <p className="text-xl font-semibold capitalize">{description || condition}</p>
            <p className="text-sm opacity-75">
              Feels like <span className="font-semibold">{formatTemp(feelsLike, unit)}</span>
            </p>
          </div>

          {/* Quick stats row */}
          <div className="flex items-center gap-4 text-sm opacity-80 pt-2">
            <span>💧 {humidity}%</span>
            <span>💨 {windSpeed} km/h</span>
          </div>
        </div>

        {/* Right – weather emoji */}
        <div className="text-8xl md:text-9xl animate-bounce-soft select-none">
          {condStyle.emoji}
        </div>
      </div>
    </div>
  );
}
