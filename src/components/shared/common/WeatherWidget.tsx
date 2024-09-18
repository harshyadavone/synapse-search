"use client";
import React, { useState, useEffect } from "react";
import { useWeather } from "@/hooks/useWeather";
import Link from "next/link";

export default function WeatherWidget(): React.ReactElement {
  const [city, setCity] = useState<string>("");
  const [showCityInput, setShowCityInput] = useState<boolean>(false);
  const [cityError, setCityError] = useState<string | null>(null);
  const {
    currentWeather: weatherData,
    isLoading,
    error,
    refetch,
  } = useWeather();
  const { data: weather } = weatherData;
  const splittedLocation = weather?.location.split(",").slice(0, -1);

  useEffect(() => {
    const storedCity = localStorage.getItem("selectedCity");
    if (!storedCity) {
      setShowCityInput(true);
    }
  }, []);

  const handleCitySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (city) {
      try {
        const isValidCity = await refetch(city);

        if (isValidCity) {
          localStorage.setItem("selectedCity", city);
          setShowCityInput(false);
          setCityError(null);
          window.location.reload();
        } else {
          setCityError("Invalid city name. Please try again.");
          setCity("");
        }
      } catch (err) {
        setCityError("Invalid city name. Please try again.");
        setCity("");
      }
    }
  };

  if (showCityInput) {
    return (
      <div
        className={`p-2 rounded-lg flex items-center justify-center h-10 md:h-12 w-48 md:w-60 bg-background/80 backdrop-blur-sm border border-border ${
          cityError && "border-destructive"
        }`}
      >
        <form onSubmit={handleCitySubmit} className="w-full">
          <input
            type="text"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setCityError(null);
            }}
            placeholder={cityError || "Enter city name, press Enter"}
            className={`w-full bg-transparent text-sm text-foreground placeholder-muted-foreground focus:outline-none
              ${cityError && "placeholder-red-500 "} 
            `}
          />
        </form>
      </div>
    );
  }

  return (
    <div>
      {isLoading ? (
        <div className="p-2 h-12 w-52 md:w-60 rounded-lg flex items-center justify-center animate-shimmer bg-gradient-to-r from-card/60 via-muted/60 to-card/60 bg-[length:200%_100%]"></div>
      ) : error || !weather ? null : (
        <div
          className={`p-2 rounded-lg flex items-center justify-center h-12 w-52 md:w-60 hover:bg-muted`}
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
