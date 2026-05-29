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
    <div className="widget">
      <p className="widget-title">WEATHER INFO</p>

      {loading && (
        <div className="flex items-center justify-center h-24 text-gray-500 text-sm">
          取得中...
        </div>
      )}

      {error && (
        <div className="text-yellow-400 text-xs text-center py-4">{error}</div>
      )}

      {weather && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs">{weather.city}</p>
              <p className="text-4xl font-bold">{weather.temp}°C</p>
              <p className="text-gray-400 text-xs capitalize mt-0.5">{weather.description}</p>
            </div>
            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt={weather.description}
              className="w-16 h-16"
            />
          </div>
          <div className="grid grid-cols-3 gap-1 text-center text-xs text-gray-400 border-t border-card-border pt-2">
            <div>
              <p className="text-white font-semibold">{weather.feels_like}°</p>
              <p>体感</p>
            </div>
            <div>
              <p className="text-white font-semibold">{weather.humidity}%</p>
              <p>湿度</p>
            </div>
            <div>
              <p className="text-white font-semibold">{weather.wind_speed}m/s</p>
              <p>風速</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
