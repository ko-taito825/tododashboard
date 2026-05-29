"use client";
import { useCallback, useEffect, useRef, useState } from "react";

const PRESETS = [
  { label: "30min", seconds: 30 * 60 },
  { label: "1hour", seconds: 60 * 60 },
];

export default function TimerWidget() {
  const [totalSeconds, setTotalSeconds] = useState(PRESETS[0].seconds);
  const [remaining, setRemaining]       = useState(PRESETS[0].seconds);
  const [running, setRunning]           = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = () => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  };

  const start = useCallback(() => {
    if (remaining === 0) return;
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) { clear(); setRunning(false); return 0; }
        return prev - 1;
      });
    }, 1000);
  }, [remaining]); // eslint-disable-line react-hooks/exhaustive-deps

  const pause = () => { clear(); setRunning(false); };
  const reset = (secs: number) => { clear(); setRunning(false); setTotalSeconds(secs); setRemaining(secs); };

  useEffect(() => () => clear(), []); // eslint-disable-line react-hooks/exhaustive-deps

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  return (
    <div className="border border-[#3a2a50] rounded-xl p-4 flex flex-col items-center gap-3 bg-[#0a0818]/60">
      {/* Time display */}
      <div className="flex items-center justify-center gap-1 font-black text-white font-mono whitespace-nowrap">
        <span className="text-5xl tracking-tight">{mm}</span>
        <span className="text-4xl text-gray-400">:</span>
        <span className="text-5xl tracking-tight">{ss}</span>
      </div>

      {/* Play / Stop buttons */}
      <div className="flex gap-6">
        <button
          onClick={running ? pause : start}
          disabled={remaining === 0}
          className="w-9 h-9 flex items-center justify-center border border-gray-600 rounded-full hover:border-accent transition-colors"
        >
          {running ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="white">
              <rect x="2" y="2" width="4" height="10" rx="1"/>
              <rect x="8" y="2" width="4" height="10" rx="1"/>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="white">
              <path d="M3 2L12 7L3 12V2Z"/>
            </svg>
          )}
        </button>
        <button
          onClick={() => reset(totalSeconds)}
          className="w-9 h-9 flex items-center justify-center border border-gray-600 rounded hover:border-accent transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="white">
            <rect x="1" y="1" width="10" height="10" rx="1"/>
          </svg>
        </button>
      </div>

      {/* Presets */}
      <div className="flex items-center gap-3 text-sm">
        {PRESETS.map(p => (
          <button
            key={p.label}
            onClick={() => reset(p.seconds)}
            className={`transition-colors ${
              totalSeconds === p.seconds ? "text-accent font-bold" : "text-gray-400 hover:text-accent-light"
            }`}
          >
            {p.label}
          </button>
        ))}
        <button className="text-gray-500 hover:text-gray-300 transition-colors text-lg leading-none">+</button>
      </div>

      {/* FOCUS TIMER label */}
      <p className="text-red-500 font-black tracking-widest text-sm">
        FOCUS TIMER 🔥
      </p>
    </div>
  );
}
