import { CurrentWeather } from "@/types";
import {
  Thermometer,
  Droplets,
  Wind,
  Eye,
  Cloud,
  Sunrise,
  Sunset,
  ArrowUp,
  ArrowDown,
  Compass,
  Gauge,
} from "lucide-react";

export function WeatherDetails({
  weather,
}: {
  weather: CurrentWeather;
}): React.ReactElement {
  const details = [
    {
      icon: <Thermometer />,
      title: "Feels Like",
      value: `${Math.round(weather.feelsLike)}°C`,
      color: "text-red-500",
    },
    {
      icon: <Droplets />,
      title: "Humidity",
      value: `${weather.humidity}%`,
      color: "text-blue-500",
    },
    {
      icon: <Wind />,
      title: "Wind Speed",
      value: `${Math.round(weather.windSpeed * 3.6)} km/h`,
      color: "text-teal-500",
    },
    {
      icon: <Compass />,
      title: "Wind Direction",
      value: `${weather.windDeg}°`,
      color: "text-indigo-500",
    },
    {
      icon: <Eye />,
      title: "Visibility",
      value: `${weather.visibility / 1000} km`,
      color: "text-purple-500",
    },
    {
      icon: <Cloud />,
      title: "Cloudiness",
      value: `${weather.clouds}%`,
      color: "text-gray-500",
    },
    {
      icon: <Gauge />,
      title: "Pressure",
      value: `${weather.pressure} hPa`,
      color: "text-yellow-500",
    },
    {
      icon: <ArrowDown />,
      title: "Min Temp",
      value: `${Math.round(weather.tempMin)}°C`,
      color: "text-blue-600",
    },
    {
      icon: <ArrowUp />,
      title: "Max Temp",
      value: `${Math.round(weather.tempMax)}°C`,
      color: "text-red-600",
    },
    {
      icon: <Sunrise />,
      title: "Sunrise",
      value: weather.sunrise,
      color: "text-orange-500",
    },
    {
      icon: <Sunset />,
      title: "Sunset",
      value: weather.sunset,
      color: "text-pink-500",
    },
  ];

  return (
    <div className="bg-background p-2 rounded-xl shadow-lg">
      <h3 className="text-2xl font-bold mb-6 text-foreground">
        Weather Details
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {details.map((detail, index) => (
          <div
            key={index}
            className="flex items-center space-x-4 p-4 bg-card rounded-lg transition-all duration-300 hover:shadow-md"
          >
            <div className={`p-3 rounded-full ${detail.color} bg-opacity-20`}>
              {detail.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {detail.title}
              </p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">
                {detail.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
