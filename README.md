# 🌦️ Weatherly - Modern Weather Dashboard

A complete, modern, and responsive weather dashboard frontend application built with **React, Vite, Tailwind CSS, Lucide React, Recharts, and Leaflet**.

![Weatherly Dashboard Preview](public/screenshot.png) <!-- (Optional) -->

---

## ✨ Features

- 🔍 **City Search**: Search weather for any city worldwide with recent search history and auto-complete dropdown.
- 📍 **Geolocation ("My Location")**: Instantly fetch weather for your exact location using browser geolocation.
- 🌡️ **Temperature Units**: Seamless °C / °F switching with instant updates across all cards and charts (persisted in localStorage).
- 🌓 **Dark & Light Mode**: Tailored glassmorphism UI with smooth theme transitions (persisted in localStorage).
- 📊 **Detailed Weather Stats**: 8 live statistics including Humidity, Wind Speed & Direction, Pressure, Visibility, UV Index, Sunrise, and Sunset.
- 🕒 **Hourly Forecast**: Horizontally scrollable timeline showing weather condition, temperature, and precipitation chance for upcoming hours.
- 📈 **Interactive Temperature Chart**: Smooth area chart built with Recharts displaying temperature trends over time.
- 📅 **7-Day Weekly Forecast**: High/low temperatures, conditions, and precipitation probability for the upcoming week.
- ⚠️ **Weather Alerts**: Severity-coded weather warnings and advisories (Info, Warning, Severe) with expandable details.
- 🗺️ **Interactive Weather Map**: Leaflet map centered dynamically on the searched location with custom marker pin and popup.
- 💡 **Personalized Weather Tips**: Contextual recommendations based on temperature, rain, wind, humidity, and UV levels.
- ⭐ **Favorite Locations**: Save and quickly access favorite cities with one click (persisted in localStorage).
- 📱 **Fully Responsive**: Optimized for desktop, tablet, and mobile layouts.
- 🛡️ **Robust Fallback Layer**: Automatic mock fallback ensuring uninterrupted UI functionality if API rate limits or invalid keys occur.

---

## 🛠️ Tech Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Maps**: [Leaflet](https://leafletjs.com/) & [React Leaflet](https://react-leaflet.js.org/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **API**: [OpenWeatherMap API](https://openweathermap.org/)

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Harshith1110-P/WeatherApp.git
cd WeatherApp
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory:
```env
VITE_WEATHER_API_KEY=your_openweathermap_api_key_here
```
*(You can get a free API key at [OpenWeatherMap](https://openweathermap.org/api))*

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for Production
```bash
npm run build
```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
