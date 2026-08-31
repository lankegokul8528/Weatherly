import React from 'react';
import { useWeather } from '../context/WeatherContext.jsx';
import { getWeatherTips } from '../utils/weatherUtils.js';

const colorMap = {
  blue: 'bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  orange: 'bg-orange-100 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
  red: 'bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800',
  yellow: 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
  teal: 'bg-teal-100 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800',
  cyan: 'bg-cyan-100 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800',
  green: 'bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800',
  purple: 'bg-purple-100 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
};

export default function WeatherTips() {
  const { currentWeather } = useWeather();
  if (!currentWeather) return null;

  const tips = getWeatherTips(currentWeather);
  if (!tips.length) return null;

  return (
    <div className="glass-card p-5 animate-fade-in">
      <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">
        💡 Weather Tips
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tips.map((tip, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 p-3 rounded-xl border transition-all duration-200 hover:scale-[1.01] animate-slide-up ${colorMap[tip.color] || colorMap.blue}`}
            style={{ animationDelay: `${idx * 60}ms` }}
          >
            <span className="text-2xl flex-shrink-0 mt-0.5" role="img" aria-label={tip.title}>
              {tip.icon}
            </span>
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">{tip.title}</p>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed">{tip.tip}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
