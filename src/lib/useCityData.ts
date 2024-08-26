import { useState, useEffect } from "react";
import axios from "axios";

export interface City {
  name: string;
  country: string;
  state: string;
  lat: number;
  lon: number;
}

type Props = {
  q?: string;
};

interface CityDataState {
  city: City | null;
  isLoading: boolean;
  error: string | null;
}

export function useCityData({ q }: Props): CityDataState {
  const [state, setState] = useState<CityDataState>({
    city: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        let city: City;
        if (q) {
          const response = await axios.get<City[]>(
            `https://api.openweathermap.org/geo/1.0/direct`,
            {
              params: {
                q,
                appid: process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY!,
              },
            }
          );

          if (response.data.length > 0) {
            const cityData = response.data[0];
            city = {
              name: cityData.name,
              country: cityData.country,
              state: cityData.state || "",
              lat: cityData.lat,
              lon: cityData.lon,
            };
          } else {
            throw new Error("City not found");
          }
        } else {
          // Get user's location based on IP
          const ipResponse = await fetch("https://api64.ipify.org?format=json");
          if (!ipResponse.ok) {
            throw new Error("Failed to fetch IP address");
          }
          const ipData = await ipResponse.json();

          const locationResponse = await fetch(
            `http://ip-api.com/json/${ipData.ip}`
          );
          if (!locationResponse.ok) {
            throw new Error("Failed to fetch location data");
          }
          const locationData = await locationResponse.json();

          city = {
            name: locationData.city,
            country: locationData.country,
            state: locationData.regionName,
            lat: locationData.lat,
            lon: locationData.lon,
          };
        }
        setState({ city, isLoading: false, error: null });
      } catch (error) {
        console.error("Error fetching city data:", error);
        setState({
          city: null,
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        });
      }
    };

    fetchData();
  }, [q]);

  return state;
}
