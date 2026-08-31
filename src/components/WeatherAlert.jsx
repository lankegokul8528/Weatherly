import React, { useState } from 'react';
import { AlertTriangle, Info, Zap, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useWeather } from '../context/WeatherContext.jsx';

const severityConfig = {
  info: {
    icon: Info,
    label: 'Information',
    className: 'alert-info',
    iconColor: 'text-blue-500',
    badgeClass: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',
  },
  warning: {
    icon: AlertTriangle,
    label: 'Warning',
    className: 'alert-warning',
    iconColor: 'text-amber-500',
    badgeClass: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400',
  },
  severe: {
    icon: Zap,
    label: 'Severe',
    className: 'alert-severe',
    iconColor: 'text-red-500',
    badgeClass: 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400',
  },
};

function AlertItem({ alert, onDismiss }) {
  const [expanded, setExpanded] = useState(false);
  const config = severityConfig[alert.severity] || severityConfig.info;
  const Icon = config.icon;

  return (
    <div className={`rounded-xl p-4 ${config.className} transition-all duration-200 animate-slide-up`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.iconColor}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${config.badgeClass}`}>
              {config.label}
            </span>
            <p className="text-sm font-semibold text-[var(--text-primary)] flex-1">
              {alert.event}
            </p>
          </div>
          {expanded && (
            <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed animate-fade-in">
              {alert.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1 rounded"
            aria-label={expanded ? 'Collapse alert' : 'Expand alert'}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onDismiss(alert.id)}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1 rounded"
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WeatherAlert() {
  const { alerts } = useWeather();
  const [dismissed, setDismissed] = useState([]);

  const visible = (alerts || []).filter((a) => !dismissed.includes(a.id));
  if (!visible.length) return null;

  function dismiss(id) {
    setDismissed((prev) => [...prev, id]);
  }

  return (
    <div className="glass-card p-5 space-y-3 animate-fade-in">
      <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
        ⚠️ Weather Alerts
      </h2>
      {visible.map((alert) => (
        <AlertItem key={alert.id} alert={alert} onDismiss={dismiss} />
      ))}
    </div>
  );
}
