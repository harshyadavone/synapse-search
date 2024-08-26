import { useCityData } from "@/lib/useCityData";
import { CurrentWeather } from "@/types";
import { useCurrentWeather } from "./useCurrentWeather";
import { UseQueryResult } from "@tanstack/react-query";

export function useWeather(cityQuery?: string): {
  currentWeather: UseQueryResult<CurrentWeather, Error>;
  isLoading: boolean;
  error: Error | null;
} {
  const {
    city,
    isLoading: isCityLoading,
    error: cityError,
  } = useCityData({ q: cityQuery });

  const currentWeather = useCurrentWeather(city);

  const isLoading = isCityLoading || currentWeather.isLoading;

  const error: Error | null = cityError
    ? new Error(cityError)
    : currentWeather.error || null;

  return {
    currentWeather: currentWeather,
    isLoading,
    error,
  };
}
