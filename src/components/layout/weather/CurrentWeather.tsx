import { CurrentWeather as WeatherTypes } from "@/types";

export function CurrentWeather({
  weather,
}: {
  weather: WeatherTypes;
}): React.ReactElement {
  return (
    <div className="p-8 rounded-xl shadow-lg relative overflow-hidden">
      {/* Add a subtle background shape */}
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>

      <div className="flex flex-col md:flex-row justify-between items-center">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold mb-2">
            {weather?.location}
          </h2>
          <p className="text-xl opacity-90">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center mt-4 md:mt-0">
          <img
            src={`http://openweathermap.org/img/wn/${weather?.icon}@4x.png`}
            alt={weather?.condition}
            className="w-32 h-32 mr-4"
          />
          <div className="text-right">
            <p className="text-6xl md:text-7xl font-bold">
              {Math.round(weather.temperature)}°C
            </p>
            <p className="text-2xl md:text-3xl">{weather?.condition}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
