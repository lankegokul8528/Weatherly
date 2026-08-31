import React from 'react';
import { Droplets } from 'lucide-react';
import { useWeather } from '../context/WeatherContext.jsx';
import { getTempValue, getConditionStyle } from '../utils/weatherUtils.js';

export default function HourlyForecast() {
  const { hourlyForecast, unit } = useWeather();
  if (!hourlyForecast?.length) return null;

  const now = new Date();
  const currentHour = now.getHours();
  const currentAmPm = currentHour >= 12 ? 'PM' : 'AM';
  const currentHour12 = currentHour % 12 || 12;
  const currentTimeLabel = `${currentHour12.toString().padStart(2, '0')} ${currentAmPm}`;

  return (
    <div className="glass-card p-5 animate-fade-in">
      <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">
        Today's Hourly Forecast
      </h2>
      <div className="scroll-x-hidden">
        <div className="flex gap-2 pb-2" style={{ minWidth: 'max-content' }}>
          {hourlyForecast.map((hour, idx) => {
            const isActive = hour.time === currentTimeLabel;
            const condStyle = getConditionStyle(hour.conditionCode);

            return (
              <div
                key={idx}
                className={`flex flex-col items-center gap-2 px-4 py-3 rounded-2xl transition-all duration-200 cursor-default
                  ${isActive
                    ? 'hourly-active scale-105'
                    : 'hover:bg-[var(--border-color)] text-[var(--text-secondary)]'
                  }`}
                style={{ minWidth: '72px' }}
              >
                <span className={`text-xs font-semibold ${isActive ? 'text-white/80' : 'text-[var(--text-muted)]'}`}>
                  {isActive ? 'Now' : hour.time}
                </span>
                <span className="text-2xl" role="img" aria-label={hour.condition}>
                  {condStyle.emoji}
                </span>
                <span className={`text-sm font-bold ${isActive ? 'text-white' : 'text-[var(--text-primary)]'}`}>
                  {getTempValue(hour.temp, unit)}°
                </span>
                <div className={`flex items-center gap-0.5 text-xs ${isActive ? 'text-white/70' : 'text-blue-400'}`}>
                  <Droplets className="w-3 h-3" />
                  <span>{hour.rainChance}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
