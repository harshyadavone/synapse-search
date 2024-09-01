import { CurrentWeather } from "@/types";
import { useCurrentWeather } from "./useCurrentWeather";
import { UseQueryResult } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export function useWeather(cityQuery?: string): {
  currentWeather: UseQueryResult<CurrentWeather, Error>;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const [city, setCity] = useState<string>("");

  useEffect(() => {
    const storedCity = localStorage.getItem("selectedCity");
    setCity(storedCity || "jaipur");

    const handleStorageChange = () => {
      const newStoredCity = localStorage.getItem("selectedCity");
      setCity(newStoredCity || "jaipur");
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const currentWeather = useCurrentWeather(city);

  const isLoading = currentWeather.isLoading || city === "";

  const refetch = () => {
    const newStoredCity = localStorage.getItem("selectedCity");
    setCity(newStoredCity || "jaipur");
    currentWeather.refetch();
  };

  const error: Error | null = currentWeather.error || null;

  return {
    currentWeather: currentWeather,
    isLoading,
    error,
    refetch,
  };
}
