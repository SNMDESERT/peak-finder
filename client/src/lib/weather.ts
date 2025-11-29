export interface WeatherData {
  temperature: number;
  windSpeed: number;
  weatherCode: number;
  isDay: boolean;
  time: string;
}

export interface WeatherForecast {
  dates: string[];
  maxTemperatures: number[];
  minTemperatures: number[];
  weatherCodes: number[];
  precipitationProbabilities: number[];
}

export interface FullWeatherData {
  current: WeatherData;
  forecast: WeatherForecast;
  elevation: number;
  location: {
    latitude: number;
    longitude: number;
  };
}

const weatherCodeDescriptions: Record<number, { description: string; icon: string }> = {
  0: { description: "Clear sky", icon: "sun" },
  1: { description: "Mainly clear", icon: "sun" },
  2: { description: "Partly cloudy", icon: "cloud-sun" },
  3: { description: "Overcast", icon: "cloud" },
  45: { description: "Fog", icon: "cloud-fog" },
  48: { description: "Depositing rime fog", icon: "cloud-fog" },
  51: { description: "Light drizzle", icon: "cloud-drizzle" },
  53: { description: "Moderate drizzle", icon: "cloud-drizzle" },
  55: { description: "Dense drizzle", icon: "cloud-drizzle" },
  56: { description: "Freezing drizzle", icon: "snowflake" },
  57: { description: "Dense freezing drizzle", icon: "snowflake" },
  61: { description: "Slight rain", icon: "cloud-rain" },
  63: { description: "Moderate rain", icon: "cloud-rain" },
  65: { description: "Heavy rain", icon: "cloud-rain" },
  66: { description: "Freezing rain", icon: "snowflake" },
  67: { description: "Heavy freezing rain", icon: "snowflake" },
  71: { description: "Slight snow", icon: "snowflake" },
  73: { description: "Moderate snow", icon: "snowflake" },
  75: { description: "Heavy snow", icon: "snowflake" },
  77: { description: "Snow grains", icon: "snowflake" },
  80: { description: "Slight rain showers", icon: "cloud-rain" },
  81: { description: "Moderate rain showers", icon: "cloud-rain" },
  82: { description: "Violent rain showers", icon: "cloud-rain" },
  85: { description: "Slight snow showers", icon: "snowflake" },
  86: { description: "Heavy snow showers", icon: "snowflake" },
  95: { description: "Thunderstorm", icon: "cloud-lightning" },
  96: { description: "Thunderstorm with hail", icon: "cloud-lightning" },
  99: { description: "Severe thunderstorm", icon: "cloud-lightning" },
};

export function getWeatherInfo(code: number) {
  return weatherCodeDescriptions[code] || { description: "Unknown", icon: "cloud" };
}

const AZERBAIJAN_LOCATIONS: Record<string, { lat: number; lon: number }> = {
  "Baku": { lat: 40.4093, lon: 49.8671 },
  "Greater Caucasus": { lat: 41.5, lon: 47.5 },
  "Lesser Caucasus": { lat: 39.5, lon: 46.5 },
  "Shaki": { lat: 41.2, lon: 47.17 },
  "Gabala": { lat: 41.0, lon: 47.85 },
  "Guba": { lat: 41.35, lon: 48.5 },
  "Khinalig": { lat: 41.18, lon: 48.12 },
  "Karabakh": { lat: 39.82, lon: 46.75 },
  "Nakhchivan": { lat: 39.2, lon: 45.45 },
  "Gobustan": { lat: 40.08, lon: 49.37 },
  "Ganja": { lat: 40.68, lon: 46.36 },
  "Lahij": { lat: 40.85, lon: 48.37 },
  "Lankaran": { lat: 38.75, lon: 48.85 },
  "Shamakhi": { lat: 40.63, lon: 48.64 },
};

export function getLocationCoordinates(location: string): { lat: number; lon: number } {
  const normalized = location.toLowerCase();
  
  for (const [key, coords] of Object.entries(AZERBAIJAN_LOCATIONS)) {
    if (normalized.includes(key.toLowerCase())) {
      return coords;
    }
  }
  
  return { lat: 40.4093, lon: 49.8671 };
}

export async function fetchWeather(
  latitude: number,
  longitude: number
): Promise<FullWeatherData> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.append("latitude", latitude.toString());
  url.searchParams.append("longitude", longitude.toString());
  url.searchParams.append("current_weather", "true");
  url.searchParams.append("daily", "weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max");
  url.searchParams.append("timezone", "auto");
  url.searchParams.append("forecast_days", "7");

  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }

  const data = await response.json();

  return {
    current: {
      temperature: data.current_weather.temperature,
      windSpeed: data.current_weather.windspeed,
      weatherCode: data.current_weather.weathercode,
      isDay: data.current_weather.is_day === 1,
      time: data.current_weather.time,
    },
    forecast: {
      dates: data.daily.time,
      maxTemperatures: data.daily.temperature_2m_max,
      minTemperatures: data.daily.temperature_2m_min,
      weatherCodes: data.daily.weathercode,
      precipitationProbabilities: data.daily.precipitation_probability_max,
    },
    elevation: data.elevation,
    location: {
      latitude,
      longitude,
    },
  };
}
