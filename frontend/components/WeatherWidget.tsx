"use client";
import { useEffect, useState } from "react";

interface WeatherData {
  temp: number;
  feels_like: number;
  humidity: number;
  description: string;
  icon: string;
  city: string;
  wind_speed: number;
}

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY ?? "";

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError]     = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!API_KEY) {
      setError("OpenWeatherMap APIキーが未設定です (.env.local)");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${API_KEY}&units=metric&lang=ja`;
          const res  = await fetch(url);
          const data = await res.json();

          if (!res.ok) throw new Error(data.message ?? "Weather API error");

          setWeather({
            temp:        Math.round(data.main.temp),
            feels_like:  Math.round(data.main.feels_like),
            humidity:    data.main.humidity,
            description: data.weather[0].description,
            icon:        data.weather[0].icon,
            city:        data.name,
            wind_speed:  data.wind.speed,
          });
        } catch (e) {
          setError(e instanceof Error ? e.message : "取得失敗");
        } finally {
          setLoading(false);
        }
      },
      () => { setError("位置情報の取得を許可してください"); setLoading(false); }
    );
  }, []);

  return (
    <div className="data-card flex flex-col h-40">
      <p className="text-accent text-xs font-bold text-center tracking-widest mb-2">Wether Info</p>

      {loading && <p className="text-gray-600 text-xs text-center mt-4">取得中...</p>}
      {error   && <p className="text-yellow-500 text-xs text-center mt-2">{error}</p>}

      {weather && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xl">☀</span>
            <span className="text-xl font-bold text-white">{weather.temp}℃</span>
            <span className="text-sm text-gray-300">{weather.city}</span>
          </div>
          <p className="text-xs text-gray-400 capitalize">{weather.description}</p>
          <div className="flex gap-3 text-xs text-gray-500 mt-1">
            <span>体感 {weather.feels_like}°</span>
            <span>湿度 {weather.humidity}%</span>
            <span>風速 {weather.wind_speed}m/s</span>
          </div>
        </div>
      )}
    </div>
  );
}
