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

  return (
    <div className="flex gap-2">
      {[hh, mm].map((val, i) => (
        <div
          key={i}
          className="bg-accent rounded-xl flex items-center justify-center"
          style={{ width: 110, height: 110 }}
        >
          <span className="text-white font-black leading-none tracking-tighter" style={{ fontSize: 64 }}>
            {val}
          </span>
        </div>
      ))}
    </div>
  );
}
