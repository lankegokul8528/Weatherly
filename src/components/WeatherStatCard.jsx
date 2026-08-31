import React from 'react';

export default function WeatherStatCard({ icon: Icon, iconBg, label, value, subtext, unit }) {
  return (
    <div className="glass-card p-4 flex flex-col gap-2 hover:scale-[1.02] transition-transform duration-200 animate-fade-in">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">{label}</p>
        <div className={`stat-icon ${iconBg}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-bold text-[var(--text-primary)]">
        {value}
        {unit && <span className="text-base font-normal text-[var(--text-secondary)] ml-0.5">{unit}</span>}
      </p>
      {subtext && (
        <p className="text-xs text-[var(--text-muted)]">{subtext}</p>
      )}
    </div>
  );
}
