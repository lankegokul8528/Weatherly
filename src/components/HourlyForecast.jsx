import React from 'react';
import { Droplets } from 'lucide-react';
import { useWeather } from '../context/WeatherContext.jsx';
import { getTempValue, getConditionStyle } from '../utils/weatherUtils.js';

export default function HourlyForecast() {
  const { hourlyForecast, hourly, unit } = useWeather();
  const data = hourlyForecast?.length ? hourlyForecast : hourly;

  if (!data?.length) return null;

  return (
    <div className="p-5 rounded-xl bg-slate-800/80 border border-slate-700/70 shadow-sm space-y-4 text-slate-100">
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
          <span>🕒</span> Hourly Forecast
        </h3>
        <span className="text-xs text-slate-400">Next 24 Hours</span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {data.slice(0, 24).map((hour, idx) => {
          const isActive = idx === 0 || hour.time === 'Now';
          const condStyle = getConditionStyle?.(hour.conditionCode || hour.condition) || { emoji: '🌤️' };
          const tempValue = getTempValue ? getTempValue(hour.temp, unit) : Math.round(hour.temp);
          const rainProb = hour.rainChance ?? hour.pop ?? 0;

          return (
            <div
              key={idx}
              className={`flex flex-col items-center justify-between min-w-[76px] p-3 rounded-lg border transition-all ${
                isActive
                  ? 'bg-blue-600/30 border-blue-500/50 text-white scale-105'
                  : 'bg-slate-900/80 border-slate-700/60 text-slate-300 hover:bg-slate-700/40'
              }`}
            >
              <span className={`text-xs font-semibold ${isActive ? 'text-blue-300' : 'text-slate-400'}`}>
                {isActive ? 'Now' : hour.time}
              </span>
              <span className="text-2xl my-1" role="img" aria-label={hour.condition || 'Weather'}>
                {condStyle.emoji}
              </span>
              <span className="text-sm font-bold text-white">{tempValue}°</span>

              {rainProb > 0 && (
                <div className="flex items-center gap-0.5 mt-1 text-[10px] text-sky-400 font-semibold">
                  <Droplets className="w-2.5 h-2.5" />
                  <span>{rainProb}%</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}