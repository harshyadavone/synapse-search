"use client";

import React from "react";
import { useWeather } from "@/hooks/useWeather";
import { ErrorState } from "@/components/shared/common/ErrorState";
import { LoadingState } from "@/components/shared/common/LoadingState";
import { CurrentWeather } from "./CurrentWeather";
import { WeatherDetails } from "./WeatherDetails";

export default function WeatherCard(): React.ReactElement {
  const { currentWeather: weather, isLoading, error } = useWeather();

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : typeof error === "string"
        ? error
        : "An error occurred while fetching data";
    return <ErrorState error={errorMessage} />;
  }

  if (!weather) {
    return <ErrorState error="Weather data unavailable" />;
  }

  return (
    <div className="max-w-full mx-auto p-8 rounded-xl">
      {weather.data && <CurrentWeather weather={weather.data} />}
      <div className="mt-8">
        {weather.data && <WeatherDetails weather={weather.data} />}
      </div>
    </div>
  );
}
