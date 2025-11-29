import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { fetchWeather, getWeatherInfo, getLocationCoordinates, type FullWeatherData } from "@/lib/weather";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  CloudFog,
  CloudSun,
  Snowflake,
  Thermometer,
  Wind,
  Droplets,
  Calendar,
  Mountain,
  AlertTriangle,
} from "lucide-react";

const weatherIcons: Record<string, React.ReactNode> = {
  sun: <Sun className="h-8 w-8 text-yellow-500" />,
  "cloud-sun": <CloudSun className="h-8 w-8 text-yellow-400" />,
  cloud: <Cloud className="h-8 w-8 text-gray-400" />,
  "cloud-rain": <CloudRain className="h-8 w-8 text-blue-400" />,
  "cloud-drizzle": <CloudDrizzle className="h-8 w-8 text-blue-300" />,
  "cloud-lightning": <CloudLightning className="h-8 w-8 text-purple-500" />,
  "cloud-fog": <CloudFog className="h-8 w-8 text-gray-400" />,
  snowflake: <Snowflake className="h-8 w-8 text-cyan-400" />,
};

const smallWeatherIcons: Record<string, React.ReactNode> = {
  sun: <Sun className="h-4 w-4 text-yellow-500" />,
  "cloud-sun": <CloudSun className="h-4 w-4 text-yellow-400" />,
  cloud: <Cloud className="h-4 w-4 text-gray-400" />,
  "cloud-rain": <CloudRain className="h-4 w-4 text-blue-400" />,
  "cloud-drizzle": <CloudDrizzle className="h-4 w-4 text-blue-300" />,
  "cloud-lightning": <CloudLightning className="h-4 w-4 text-purple-500" />,
  "cloud-fog": <CloudFog className="h-4 w-4 text-gray-400" />,
  snowflake: <Snowflake className="h-4 w-4 text-cyan-400" />,
};

interface WeatherCardProps {
  location: string;
  elevation?: number | null;
}

export function WeatherCard({ location, elevation }: WeatherCardProps) {
  const { t } = useTranslation();
  const coords = getLocationCoordinates(location);

  const { data: weather, isLoading, error } = useQuery<FullWeatherData>({
    queryKey: ["weather", coords.lat, coords.lon],
    queryFn: () => fetchWeather(coords.lat, coords.lon),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });

  const weekdayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

  const getWeekdayLabel = (index: number, dayDate: Date) => {
    if (index === 0) return t("weather.days.today", "Today");
    const dayKey = weekdayKeys[dayDate.getDay()];
    return t(`weather.days.${dayKey}`, dayKey.charAt(0).toUpperCase() + dayKey.slice(1));
  };

  if (isLoading) {
    return (
      <Card data-testid="card-weather-loading">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !weather) {
    return (
      <Card data-testid="card-weather-error">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertTriangle className="h-5 w-5" />
            <span className="text-sm">{t("weather.unableToLoad", "Unable to load weather data")}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentWeatherInfo = getWeatherInfo(weather.current.weatherCode);

  const getMountainCondition = (
    temp: number,
    windSpeed: number,
    weatherCode: number
  ): { label: string; labelKey: string; color: string } => {
    if (weatherCode >= 95) {
      return { label: "Dangerous", labelKey: "dangerous", color: "bg-red-500" };
    }
    if (weatherCode >= 65 || weatherCode >= 73) {
      return { label: "Poor", labelKey: "poor", color: "bg-orange-500" };
    }
    if (windSpeed > 50) {
      return { label: "Windy", labelKey: "windy", color: "bg-yellow-500" };
    }
    if (temp < 0) {
      return { label: "Cold", labelKey: "cold", color: "bg-blue-500" };
    }
    if (weatherCode <= 3 && windSpeed < 30 && temp > 5 && temp < 25) {
      return { label: "Excellent", labelKey: "excellent", color: "bg-green-500" };
    }
    return { label: "Good", labelKey: "good", color: "bg-emerald-500" };
  };

  const condition = getMountainCondition(
    weather.current.temperature,
    weather.current.windSpeed,
    weather.current.weatherCode
  );

  return (
    <Card data-testid="card-weather">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base">
          <span className="flex items-center gap-2">
            <Cloud className="h-4 w-4 text-primary" />
            {t("weather.mountainWeather", "Mountain Weather")}
          </span>
          <Badge className={`${condition.color} text-white`} data-testid="badge-condition">
            {t(`weather.conditions.${condition.labelKey}`, condition.label)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {weatherIcons[currentWeatherInfo.icon] || weatherIcons.cloud}
            <div>
              <div className="flex items-center gap-1">
                <Thermometer className="h-4 w-4 text-red-400" />
                <span className="text-2xl font-bold" data-testid="text-temperature">
                  {Math.round(weather.current.temperature)}°C
                </span>
              </div>
              <p className="text-sm text-muted-foreground" data-testid="text-weather-description">
                {currentWeatherInfo.description}
              </p>
            </div>
          </div>
          <div className="text-right space-y-1">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Wind className="h-3 w-3" />
              <span data-testid="text-wind-speed">{Math.round(weather.current.windSpeed)} {t("weather.kmh", "km/h")}</span>
            </div>
            {(elevation || weather.elevation) && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Mountain className="h-3 w-3" />
                <span data-testid="text-elevation">
                  {elevation || Math.round(weather.elevation)}{t("weather.meters", "m")}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="border-t pt-3">
          <div className="flex items-center gap-1 mb-2">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{t("weather.sevenDayForecast", "7-Day Forecast")}</span>
          </div>
          <div className="grid grid-cols-7 gap-1" data-testid="weather-forecast">
            {weather.forecast.dates.slice(0, 7).map((date, index) => {
              const forecastInfo = getWeatherInfo(weather.forecast.weatherCodes[index]);
              const dayDate = new Date(date);
              const dayName = getWeekdayLabel(index, dayDate);

              return (
                <div
                  key={date}
                  className="flex flex-col items-center gap-1 text-center"
                  data-testid={`forecast-day-${index}`}
                >
                  <span className="text-xs text-muted-foreground">{dayName}</span>
                  {smallWeatherIcons[forecastInfo.icon] || smallWeatherIcons.cloud}
                  <div className="text-xs">
                    <span className="font-medium">
                      {Math.round(weather.forecast.maxTemperatures[index])}°
                    </span>
                    <span className="text-muted-foreground">
                      /{Math.round(weather.forecast.minTemperatures[index])}°
                    </span>
                  </div>
                  {weather.forecast.precipitationProbabilities[index] > 20 && (
                    <div className="flex items-center gap-0.5 text-xs text-blue-400">
                      <Droplets className="h-2.5 w-2.5" />
                      {weather.forecast.precipitationProbabilities[index]}%
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
