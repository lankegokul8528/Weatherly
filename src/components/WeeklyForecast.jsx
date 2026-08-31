import React from 'react';
import { Droplets } from 'lucide-react';
import { useWeather } from '../context/WeatherContext.jsx';
import { getTempValue, getConditionStyle } from '../utils/weatherUtils.js';

export default function WeeklyForecast() {
  const { weeklyForecast, unit } = useWeather();
  if (!weeklyForecast?.length) return null;

  return (
    <div className="glass-card p-5 animate-fade-in">
      <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">
        7-Day Forecast
      </h2>
      <div className="space-y-1">
        {weeklyForecast.map((day, idx) => {
          const condStyle = getConditionStyle(day.conditionCode);
          return (
            <div
              key={idx}
              className={`flex items-center justify-between gap-3 px-3 py-3 rounded-xl transition-colors duration-150
                ${idx === 0 ? 'bg-blue-500/10 border border-blue-500/20' : 'hover:bg-[var(--border-color)]'}
              `}
            >
              {/* Day + Date */}
              <div className="w-28 flex-shrink-0">
                <p className={`text-sm font-semibold ${idx === 0 ? 'text-blue-400' : 'text-[var(--text-primary)]'}`}>
                  {day.day}
                </p>
                <p className="text-xs text-[var(--text-muted)]">{day.dateDisplay || day.date}</p>
              </div>

              {/* Icon + Condition */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-xl" role="img" aria-label={day.condition}>{condStyle.emoji}</span>
                <span className="text-xs text-[var(--text-secondary)] truncate hidden sm:block">{day.condition}</span>
              </div>

              {/* Rain chance */}
              <div className="flex items-center gap-1 w-14 justify-end">
                {day.rainChance > 0 && (
                  <>
                    <Droplets className="w-3 h-3 text-blue-400 flex-shrink-0" />
                    <span className="text-xs text-blue-400 font-medium">{day.rainChance}%</span>
                  </>
                )}
              </div>

              {/* High / Low */}
              <div className="flex items-center gap-2 w-24 justify-end flex-shrink-0">
                <span className="text-sm font-bold text-[var(--text-primary)]">
                  {getTempValue(day.high, unit)}°
                </span>
                <span className="text-sm text-[var(--text-muted)]">
                  {getTempValue(day.low, unit)}°
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
