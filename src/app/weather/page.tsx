"use client";
import WeatherCard from "@/components/layout/weather/WeatherCard";
import Link from "next/link";

export default function WeatherPage() {
  return (
    <div className="p-2 md:p-14">
      <Link
        href="/"
        className="text-primary hover:underline mb-4 inline-block pt-4"
      >
        &larr; Back to Home
      </Link>
      <WeatherCard />
    </div>
  );
}
