import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import Login from "./Login";
import Register from "./Register";
import { WeatherProvider } from "./context/WeatherContext";
import AdminDashboard from "./components/AdminDashboard";

// Import components
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

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        if (currentUser.email === "admin@weatherly.com") {
          setRole("admin");
        } else {
          try {
            const userDoc = await getDoc(doc(db, "users", currentUser.uid));
            setRole(userDoc.exists() ? userDoc.data().role : "user");
          } catch (error) {
            console.error("Error fetching user role:", error);
            setRole("user");
          }
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", color: "#fff", background: "#0f172a" }}>
        Loading Weatherly...
      </div>
    );
  }

  // If no user logged in, render Login OR Register exclusively
  if (!user) {
    return isRegistering ? (
      <Register onSwitch={() => setIsRegistering(false)} />
    ) : (
      <Login onSwitch={() => setIsRegistering(true)} />
    );
  }

  return (
    <div className="app-container">
      {/* Top Bar */}
      <header style={{ display: "flex", justifyContent: "space-between", padding: "12px 24px", background: "#1e293b", color: "#fff", alignItems: "center" }}>
        <span>
          Welcome, <strong>{user.email}</strong> ({role === "admin" ? "Admin" : "User"})
        </span>
        <button
          onClick={() => signOut(auth)}
          style={{ padding: "6px 14px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
        >
          Log Out
        </button>
      </header>

      {/* Role-based Dashboard */}
      {role === "admin" ? (
        <AdminDashboard />
      ) : (
        <WeatherProvider>
          <Header />
          <main style={{ padding: "20px" }}>
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
        </WeatherProvider>
      )}
    </div>
  );
}

export default App;