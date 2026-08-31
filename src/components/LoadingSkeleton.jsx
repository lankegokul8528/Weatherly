import React from 'react';

/* ============================================================
   Skeleton pulse block
   ============================================================ */
function SkeletonBlock({ className = '' }) {
  return <div className={`skeleton animate-shimmer ${className}`} />;
}

/* ============================================================
   Current Weather Skeleton
   ============================================================ */
export function CurrentWeatherSkeleton() {
  return (
    <div className="glass-card p-8 animate-fade-in">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="flex-1 space-y-4 w-full">
          <SkeletonBlock className="h-6 w-48 rounded-lg" />
          <SkeletonBlock className="h-20 w-40 rounded-xl" />
          <SkeletonBlock className="h-5 w-32 rounded-lg" />
          <SkeletonBlock className="h-5 w-40 rounded-lg" />
        </div>
        <SkeletonBlock className="w-36 h-36 rounded-2xl flex-shrink-0" />
      </div>
    </div>
  );
}

/* ============================================================
   Weather Stats Skeleton
   ============================================================ */
export function WeatherStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="glass-card p-4 space-y-3">
          <SkeletonBlock className="h-4 w-20 rounded" />
          <SkeletonBlock className="h-7 w-16 rounded" />
          <SkeletonBlock className="h-3 w-24 rounded" />
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   Hourly Forecast Skeleton
   ============================================================ */
export function HourlyForecastSkeleton() {
  return (
    <div className="glass-card p-5 animate-fade-in">
      <SkeletonBlock className="h-5 w-40 rounded mb-4" />
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 space-y-2 w-16">
            <SkeletonBlock className="h-4 w-12 rounded" />
            <SkeletonBlock className="h-8 w-8 rounded-full mx-auto" />
            <SkeletonBlock className="h-4 w-10 rounded" />
            <SkeletonBlock className="h-3 w-8 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   Chart Skeleton
   ============================================================ */
export function ChartSkeleton() {
  return (
    <div className="glass-card p-5 animate-fade-in">
      <SkeletonBlock className="h-5 w-48 rounded mb-4" />
      <SkeletonBlock className="h-48 w-full rounded-xl" />
    </div>
  );
}

/* ============================================================
   Weekly Forecast Skeleton
   ============================================================ */
export function WeeklyForecastSkeleton() {
  return (
    <div className="glass-card p-5 animate-fade-in space-y-3">
      <SkeletonBlock className="h-5 w-32 rounded mb-2" />
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between gap-3">
          <SkeletonBlock className="h-4 w-20 rounded" />
          <SkeletonBlock className="h-6 w-6 rounded-full" />
          <SkeletonBlock className="h-4 w-24 rounded" />
          <SkeletonBlock className="h-4 w-16 rounded" />
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   Map Skeleton
   ============================================================ */
export function MapSkeleton() {
  return (
    <div className="glass-card p-5 animate-fade-in">
      <SkeletonBlock className="h-5 w-32 rounded mb-4" />
      <SkeletonBlock className="h-64 w-full rounded-xl" />
    </div>
  );
}

/* ============================================================
   Generic Skeleton Card
   ============================================================ */
export function GenericCardSkeleton({ lines = 3 }) {
  return (
    <div className="glass-card p-5 animate-fade-in space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBlock key={i} className={`h-4 rounded ${i === 0 ? 'w-40' : 'w-full'}`} />
      ))}
    </div>
  );
}
