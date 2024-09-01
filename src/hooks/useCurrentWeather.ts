import { City, CurrentWeather } from "@/types";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

export function useCurrentWeather(
  city: string
): UseQueryResult<CurrentWeather, Error> {
  return useQuery<CurrentWeather, Error>({
    queryKey: ["currentWeather", city],
    queryFn: async () => {
      if (!city) throw new Error("City data is not available");
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      if (!response.ok)
        throw new Error(`Failed to fetch weather data: ${response.statusText}`);
      const data = await response.json();
      return {
        location: `${data.name}, ${data.sys.country}`,
        temperature: data.main.temp,
        feelsLike: data.main.feels_like,
        tempMin: data.main.temp_min,
        tempMax: data.main.temp_max,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        windSpeed: data.wind.speed,
        windDeg: data.wind.deg,
        clouds: data.clouds.all,
        visibility: data.visibility,
        condition: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
        sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString(),
      };
    },
    enabled: !!city,
    retry: 2,
    retryDelay: 1000,
  });
}
