import React from 'react';
import { WeatherProvider } from './context/WeatherContext.jsx';
import Header from './components/Header.jsx';
import Dashboard from './pages/Dashboard.jsx';

export default function App() {
  return (
    <WeatherProvider>
      <div className="min-h-screen bg-[var(--bg-primary)] transition-theme">
        <Header />
        <Dashboard />
      </div>
    </WeatherProvider>
  );
}
