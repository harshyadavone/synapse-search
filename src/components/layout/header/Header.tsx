import Link from "next/link";
import { Settings, User } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import WeatherWidget from "@/components/shared/common/WeatherWidget";
import { Suspense } from "react";
import { UserPreferences } from "@/app/page";

export default function Header({
  onCustomize,
  preferences,
}: {
  onCustomize: () => void;
  preferences: UserPreferences;
}) {
  return (
    <header className="w-full top-0">
      <div className="flex items-end justify-end p-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4">
          {preferences.showWeather && (
            <Suspense fallback={<div>Loading...</div>}>
              <WeatherWidget />
            </Suspense>
          )}
          <ThemeToggle />
          <button
            onClick={onCustomize}
            className="p-1.5 md:p-3 rounded-lg hover:bg-muted"
            aria-label="Settings"
          >
            <Settings size={20} />
          </button>
          <Link
            href="/profile"
            className="p-1.5 md:p-3 rounded-lg hover:bg-muted"
            aria-label="Profile"
          >
            <User size={20} />
          </Link>
        </div>
      </div>
    </header>
  );
}
