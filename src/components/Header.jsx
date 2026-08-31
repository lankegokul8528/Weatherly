import React from 'react';
import { Cloud, Sun, Moon, Menu, X } from 'lucide-react';
import { useState } from 'react';
import SearchBar from './SearchBar.jsx';
import LocationButton from './LocationButton.jsx';
import { useWeather } from '../context/WeatherContext.jsx';

export default function Header() {
  const { theme, toggleTheme, unit, setUnit } = useWeather();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-color)] backdrop-blur-xl bg-[var(--glass-bg)] transition-theme">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 h-16">

          {/* Logo + Name */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Cloud className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent hidden sm:block">
              Weatherly
            </span>
          </div>

          {/* Search – center, grows */}
          <div className="flex-1 flex justify-center px-2">
            <SearchBar />
          </div>

          {/* Desktop Controls */}
          <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
            <LocationButton />

            {/* Unit Toggle */}
            <div className="flex items-center rounded-xl border border-[var(--border-color)] bg-[var(--glass-bg)] backdrop-blur-md overflow-hidden">
              <button
                onClick={() => setUnit('C')}
                className={`px-3 py-2 text-sm font-semibold transition-all duration-200
                  ${unit === 'C'
                    ? 'bg-blue-600 text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                aria-label="Switch to Celsius"
                aria-pressed={unit === 'C'}
              >
                °C
              </button>
              <div className="w-px h-5 bg-[var(--border-color)]" />
              <button
                onClick={() => setUnit('F')}
                className={`px-3 py-2 text-sm font-semibold transition-all duration-200
                  ${unit === 'F'
                    ? 'bg-blue-600 text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                aria-label="Switch to Fahrenheit"
                aria-pressed={unit === 'F'}
              >
                °F
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl border border-[var(--border-color)] bg-[var(--glass-bg)] backdrop-blur-md
                flex items-center justify-center text-[var(--text-secondary)]
                hover:text-[var(--text-primary)] hover:border-blue-500
                transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="sm:hidden w-9 h-9 rounded-xl border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] flex-shrink-0"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile expanded menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden pb-4 space-y-3 animate-slide-up">
            <div className="flex items-center gap-2">
              <LocationButton />
              {/* Unit Toggle */}
              <div className="flex items-center rounded-xl border border-[var(--border-color)] bg-[var(--glass-bg)] overflow-hidden">
                <button
                  onClick={() => setUnit('C')}
                  className={`px-3 py-2 text-sm font-semibold transition-all ${unit === 'C' ? 'bg-blue-600 text-white' : 'text-[var(--text-secondary)]'}`}
                >°C</button>
                <div className="w-px h-5 bg-[var(--border-color)]" />
                <button
                  onClick={() => setUnit('F')}
                  className={`px-3 py-2 text-sm font-semibold transition-all ${unit === 'F' ? 'bg-blue-600 text-white' : 'text-[var(--text-secondary)]'}`}
                >°F</button>
              </div>
              <button
                onClick={toggleTheme}
                className="w-9 h-9 rounded-xl border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)]"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
