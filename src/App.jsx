import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import Login from "./Login";
import Register from "./Register";
import AdminDashboard from "./components/AdminDashboard";

// Component Imports
import Header from "./components/Header";
import CurrentWeather from "./components/CurrentWeather";
import HourlyForecast from "./components/HourlyForecast";
import WeeklyForecast from "./components/WeeklyForecast";
import WeatherStats from "./components/WeatherStats";
import TemperatureChart from "./components/TemperatureChart";
import FavoriteLocations from "./components/FavoriteLocations";
import RecentSearches from "./components/RecentSearches";
import WeatherAlert from "./components/WeatherAlert";
import WeatherTips from "./components/WeatherTips";
import WeatherMap from "./components/WeatherMap";

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [activeTab, setActiveTab] = useState("weather");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        let userRole = "user";
        if (currentUser.email === "admin@weatherly.com") {
          userRole = "admin";
        } else {
          try {
            const userDoc = await getDoc(doc(db, "users", currentUser.uid));
            userRole = userDoc.exists() ? userDoc.data().role : "user";
          } catch (error) {
            console.error("Error fetching user role:", error);
            userRole = "user";
          }
        }
        setRole(userRole);
        // Default to weather view so weather components mount immediately
        setActiveTab("weather");
      } else {
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-slate-950 font-sans">
        Loading Weatherly...
      </div>
    );
  }

  if (!user) {
    return isRegistering ? (
      <Register onSwitch={() => setIsRegistering(false)} />
    ) : (
      <Login onSwitch={() => setIsRegistering(true)} />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <header className="flex flex-col sm:flex-row items-center justify-between px-6 py-3 bg-slate-900 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-200">
            Welcome, <strong className="text-white">{user.email}</strong>{" "}
            <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
              {role === "admin" ? "Admin" : "User"}
            </span>
          </span>

          {role === "admin" && (
            <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700">
              <button
                onClick={() => setActiveTab("weather")}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  activeTab === "weather"
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                🌤️ Weather View
              </button>
              <button
                onClick={() => setActiveTab("admin")}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  activeTab === "admin"
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                🛠️ Admin Control
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => signOut(auth)}
          className="px-3.5 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
        >
          Log Out
        </button>
      </header>

      {role === "admin" && activeTab === "admin" ? (
        <AdminDashboard />
      ) : (
        <>
          <Header />
          <main className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
            <WeatherAlert />
            <CurrentWeather />
            <WeatherStats />
            <HourlyForecast />
            <WeeklyForecast />
            <TemperatureChart />
            <WeatherMap />
            <FavoriteLocations />
            <RecentSearches />
            <WeatherTips />
          </main>
        </>
      )}
    </div>
  );
}