import React from 'react';
import { AlertCircle, RefreshCw, MapPin } from 'lucide-react';

export default function ErrorMessage({ message, onRetry }) {
  const isNotFound = message?.toLowerCase().includes('not found') || message?.toLowerCase().includes('city');

  return (
    <div className="glass-card p-8 flex flex-col items-center justify-center text-center space-y-4 animate-fade-in min-h-[200px]">
      <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
        {isNotFound ? (
          <MapPin className="w-8 h-8 text-red-500" />
        ) : (
          <AlertCircle className="w-8 h-8 text-red-500" />
        )}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-red-500 mb-1">
          {isNotFound ? 'Location Not Found' : 'Something Went Wrong'}
        </h3>
        <p className="text-sm text-[var(--text-secondary)] max-w-sm">
          {isNotFound
            ? "Couldn't find that location. Try another city name or check your spelling."
            : message || 'An unexpected error occurred. Please try again.'}
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
          aria-label="Retry loading weather data"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
}
