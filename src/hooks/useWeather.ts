import { CurrentWeather } from "@/types";
import { useCurrentWeather } from "./useCurrentWeather";
import { UseQueryResult } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export function useWeather(): {
  currentWeather: UseQueryResult<CurrentWeather, Error>;
  isLoading: boolean;
  error: Error | null;
  refetch: (cityQuery?: string) => Promise<boolean>; // Make refetch return a boolean
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

  // Refetch the weather for a specific city and return a boolean based on success
  const refetch = async (cityQuery?: string): Promise<boolean> => {
    const newCity =
      cityQuery || localStorage.getItem("selectedCity") || "jaipur";
    setCity(newCity);

    try {
      const result = await currentWeather.refetch();

      // If the weather data is fetched successfully, return true
      if (result.data) {
        return true;
      } else {
        return false; // Return false if the city is invalid
      }
    } catch (error) {
      return false; // Return false if there's an error during fetching
    }
  };

  const error: Error | null = currentWeather.error || null;

  return {
    currentWeather: currentWeather,
    isLoading,
    error,
    refetch, // returns a boolean indicating success or failure
  };
}
