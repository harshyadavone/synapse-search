"use client";
import WeatherCard from "@/components/layout/weather/WeatherCard";
import Link from "next/link";

export default function WeatherPage() {
  return (
    <div className="p-8">
      <Link
        href="/"
        className="text-primary hover:underline mb-4 inline-block"
      >
        &larr; Back to Home
      </Link>
      {/* <h1 className="text-3xl font-bold mb-6">Detailed Weather Information</h1> */}
      <WeatherCard />
    </div>
  );
}
