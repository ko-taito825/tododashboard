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
    <div className="flex gap-2 pt-2 justify-center">
      {[hh, mm].map((val, i) => (
        <div
          key={i}
          className="bg-accent rounded-lg flex items-center justify-center"
          style={{ width: 100, height: 100 }}
        >
          <span className="text-white font-black text-5xl leading-none tracking-tight">
            {val}
          </span>
        </div>
      ))}
    </div>
  );
}
