"use client";

import React, { useState } from "react";
import { useWeather } from "@/hooks/useWeather";
import { ErrorState } from "@/components/shared/common/ErrorState";
import { LoadingState } from "@/components/shared/common/LoadingState";
import { CurrentWeather } from "./CurrentWeather";
import { WeatherDetails } from "./WeatherDetails";
import { MapPin, Search, X } from "lucide-react";

export default function WeatherCard(): React.ReactElement {
  const [isEditing, setIsEditing] = useState(false);
  const [newCity, setNewCity] = useState("");
  const { currentWeather: weather, isLoading, error, refetch } = useWeather();

  const handleCityChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newCity) {
      localStorage.setItem("selectedCity", newCity);
      refetch();
      setIsEditing(false);
      setNewCity("");
    }
  };

  if (isLoading) return <LoadingState />;
  if (error)
    return (
      <ErrorState
        error={error instanceof Error ? error.message : "An error occurred"}
      />
    );
  if (!weather || !weather.data)
    return <ErrorState error="Weather data unavailable" />;

  return (
    <div className="max-w-full">
      <div className="flex flex-col sm:flex-row items-center justify-start mb-6">
        {isEditing ? (
          <div className="p-2 rounded-lg flex items-center justify-center h-10 md:h-12 w-full md:w-80 bg-background/80 backdrop-blur-sm border border-border">
            <form onSubmit={handleCityChange} className="w-full relative">
              <div className="flex items-center">
                <input
                  type="text"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  placeholder="Enter city name"
                  aria-label="Enter city name"
                  className="w-full bg-transparent text-sm text-foreground placeholder-muted-foreground focus:outline-none pr-16"
                />
                <div className="absolute right-0 flex">
                  <button
                    onClick={() => setIsEditing(false)}
                    type="button"
                    aria-label="Cancel city change"
                    className="text-primary hover:text-primary/80 transition-colors p-1"
                  >
                    <X size={20} />
                  </button>
                  <button
                    type="submit"
                    aria-label="Submit city change"
                    className="text-primary hover:text-primary/80 transition-colors p-1"
                  >
                    <Search size={20} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <MapPin size={24} className="text-primary" />
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
              {weather.data.location}
            </h2>
          </div>
        )}
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 sm:mt-0 sm:ml-4 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
          >
            Change City
          </button>
        )}
      </div>

      <CurrentWeather weather={weather.data} />
      <div className="mt-8">
        <WeatherDetails weather={weather.data} />
      </div>
    </div>
  );
}
