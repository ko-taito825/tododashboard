"use client";
import { useEffect, useState } from "react";

export default function CurrentTime() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months   = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const dateStr  = `${weekdays[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()} ${now.getFullYear()}`;

  return (
    <div className="widget justify-center items-center text-center py-6">
      <p className="widget-title">CURRENT TIME</p>
      <div className="font-mono text-6xl font-bold tracking-tight text-white leading-none">
        {hh}
        <span className="animate-pulse text-accent">:</span>
        {mm}
        <span className="text-3xl text-gray-400 ml-2">{ss}</span>
      </div>
      <p className="text-gray-400 text-sm mt-1">{dateStr}</p>
    </div>
  );
}
