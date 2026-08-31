import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useWeather } from '../context/WeatherContext.jsx';
import { getTempValue } from '../utils/weatherUtils.js';

function CustomTooltip({ active, payload, label, unit }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3 py-2 text-sm">
      <p className="font-semibold text-[var(--text-primary)]">{label}</p>
      <p className="text-blue-400 font-bold">
        {payload[0].value}°{unit}
      </p>
    </div>
  );
}

export default function TemperatureChart() {
  const { hourlyForecast, unit, theme } = useWeather();
  if (!hourlyForecast?.length) return null;

  const data = hourlyForecast.map((h) => ({
    time: h.time,
    temp: getTempValue(h.temp, unit),
  }));

  const minTemp = Math.min(...data.map((d) => d.temp)) - 2;
  const maxTemp = Math.max(...data.map((d) => d.temp)) + 2;

  const strokeColor = '#60a5fa';
  const gradientStart = 'rgba(96, 165, 250, 0.4)';
  const gradientEnd = 'rgba(96, 165, 250, 0)';
  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const textColor = theme === 'dark' ? '#64748b' : '#94a3b8';

  return (
    <div className="glass-card p-5 animate-fade-in">
      <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-5">
        Temperature Throughout the Day
      </h2>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={gradientStart} />
                <stop offset="100%" stopColor={gradientEnd} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fill: textColor, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              interval={1}
            />
            <YAxis
              domain={[minTemp, maxTemp]}
              tick={{ fill: textColor, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}°`}
            />
            <Tooltip content={<CustomTooltip unit={unit} />} cursor={{ stroke: strokeColor, strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area
              type="monotone"
              dataKey="temp"
              stroke={strokeColor}
              strokeWidth={2.5}
              fill="url(#tempGradient)"
              dot={{ fill: strokeColor, strokeWidth: 0, r: 3 }}
              activeDot={{ r: 5, fill: strokeColor, strokeWidth: 2, stroke: '#fff' }}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
