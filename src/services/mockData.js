export const mockCurrentWeather = {
  city: 'Vijayawada',
  country: 'IN',
  countryName: 'India',
  lat: 16.5062,
  lon: 80.6480,
  temp: 32,
  feelsLike: 35,
  humidity: 68,
  windSpeed: 14,
  windDeg: 225,
  pressure: 1012,
  visibility: 8,
  uvIndex: 7,
  sunrise: 1693441800,
  sunset: 1693486800,
  condition: 'Sunny',
  conditionCode: 800,
  icon: '01d',
  description: 'clear sky',
  timezone: 19800,
};

const now = new Date();
const conditionsList = [
  { condition: 'Sunny', conditionCode: 800, icon: '01d', rainChance: 5 },
  { condition: 'Clear', conditionCode: 800, icon: '01d', rainChance: 5 },
  { condition: 'Partly Cloudy', conditionCode: 801, icon: '02d', rainChance: 12 },
  { condition: 'Cloudy', conditionCode: 802, icon: '03d', rainChance: 25 },
  { condition: 'Light Rain', conditionCode: 500, icon: '10d', rainChance: 45 },
];

export const mockHourlyForecast = Array.from({ length: 12 }, (_, i) => {
  const hourTime = new Date(now.getTime() + i * 60 * 60 * 1000);
  const timeLabel = i === 0 
    ? 'Now' 
    : hourTime.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
    
  const cond = conditionsList[i % conditionsList.length];

  return {
    time: timeLabel,
    temp: 32 - Math.floor(i / 2) + (i % 2),
    conditionCode: cond.conditionCode,
    icon: cond.icon,
    rainChance: cond.rainChance,
    condition: cond.condition,
  };
});

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const mockWeeklyForecast = Array.from({ length: 7 }, (_, idx) => {
  const futureDate = new Date(now);
  futureDate.setDate(now.getDate() + idx);

  const isToday = idx === 0;
  const high = 34 - idx + (idx % 2 === 0 ? 1 : 0);
  const low = 27 - Math.floor(idx / 2);

  return {
    day: isToday ? 'Today' : dayNames[futureDate.getDay()],
    date: `${monthNames[futureDate.getMonth()]} ${futureDate.getDate()}`,
    dateDisplay: `${monthNames[futureDate.getMonth()]} ${futureDate.getDate()}`,
    conditionCode: idx % 3 === 0 ? 800 : idx % 3 === 1 ? 801 : 500,
    icon: idx % 3 === 0 ? '01d' : idx % 3 === 1 ? '02d' : '10d',
    condition: idx % 3 === 0 ? 'Sunny' : idx % 3 === 1 ? 'Partly Cloudy' : 'Light Rain',
    high: high,
    low: low,
    tempMax: high,
    tempMin: low,
    rainChance: idx * 12,
  };
});

export const mockAlerts = [
  {
    id: 2,
    severity: 'info',
    event: 'High UV Index',
    description: 'UV index will be very high today between 10 AM and 4 PM. Apply sunscreen and limit outdoor exposure.',
    start: Date.now(),
    end: Date.now() + 12 * 60 * 60 * 1000,
  },
];

export const mockCities = {
  london: {
    city: 'London',
    country: 'GB',
    countryName: 'United Kingdom',
    lat: 51.5074,
    lon: -0.1278,
    temp: 18,
    feelsLike: 16,
    humidity: 72,
    windSpeed: 22,
    windDeg: 270,
    pressure: 1008,
    visibility: 10,
    uvIndex: 3,
    sunrise: 1693452000,
    sunset: 1693499400,
    condition: 'Partly Cloudy',
    conditionCode: 802,
    icon: '03d',
    description: 'scattered clouds',
    timezone: 3600,
  },
  newyork: {
    city: 'New York',
    country: 'US',
    countryName: 'United States',
    lat: 40.7128,
    lon: -74.0060,
    temp: 24,
    feelsLike: 25,
    humidity: 58,
    windSpeed: 18,
    windDeg: 180,
    pressure: 1015,
    visibility: 12,
    uvIndex: 5,
    sunrise: 1693451400,
    sunset: 1693497000,
    condition: 'Cloudy',
    conditionCode: 804,
    icon: '04d',
    description: 'overcast clouds',
    timezone: -14400,
  },
  tokyo: {
    city: 'Tokyo',
    country: 'JP',
    countryName: 'Japan',
    lat: 35.6762,
    lon: 139.6503,
    temp: 28,
    feelsLike: 31,
    humidity: 80,
    windSpeed: 10,
    windDeg: 90,
    pressure: 1010,
    visibility: 9,
    uvIndex: 6,
    sunrise: 1693435200,
    sunset: 1693479600,
    condition: 'Humid',
    conditionCode: 721,
    icon: '50d',
    description: 'haze',
    timezone: 32400,
  },
};