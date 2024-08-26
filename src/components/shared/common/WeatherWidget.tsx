import React from "react";
import { useWeather } from "@/hooks/useWeather";
import Link from "next/link";

export default function WeatherWidget(): React.ReactElement {
  const { currentWeather: weatherData, isLoading, error } = useWeather();
  const { data: weather } = weatherData;
  // This line is splitting the location string into an array of words based on the comma separator. Then it's slicing the array to remove the last word (country). This is done to display the location in a more readable format - it gets rid of the country name in the location string and only displays the city name.
  const splittedLocation = weather?.location.split(",").slice(0, -1);

  return (
    <div>
      {isLoading ? (
        <div className="p-2 h-12 w-52 md:w-60 rounded-lg flex items-center justify-center animate-shimmer bg-gradient-to-r from-card/60 via-muted/60 to-card/60 bg-[length:200%_100%]"></div>
      ) : error || !weather ? null : (
        <div
          className={`p-2 rounded-lg flex items-center justify-center h-12 w-52 md:w-60  hover:bg-muted
      }`}
        >
          <Link
            href="/weather"
            className="flex flex-grow items-center justify-center space-x-4"
          >
            <h3 className="text-sm md:text-md font-medium text-foreground truncate">
              {splittedLocation}
            </h3>
            <img
              src={`http://openweathermap.org/img/wn/${weather.icon}.png`}
              alt={weather.condition}
              className="w-12 h-12"
            />
            <div className="text-right">
              <p className="text-sm md:text-md font-semibold text-foreground">
                {Math.round(weather.temperature)}°C
              </p>
              <p className="text-xs text-muted-foreground">
                {weather.condition}
              </p>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
