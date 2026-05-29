"use client";
import { useCallback, useEffect, useRef, useState } from "react";

const PRESETS = [
  { label: "25 min", seconds: 25 * 60 },
  { label: "30 min", seconds: 30 * 60 },
  { label: "1 hour", seconds: 60 * 60 },
];

export default function TimerWidget() {
  const [totalSeconds, setTotalSeconds] = useState(PRESETS[0].seconds);
  const [remaining, setRemaining]       = useState(PRESETS[0].seconds);
  const [running, setRunning]           = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const start = useCallback(() => {
    if (remaining === 0) return;
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clear();
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [remaining]);

  const pause = () => { clear(); setRunning(false); };
  const reset = (secs: number) => { clear(); setRunning(false); setTotalSeconds(secs); setRemaining(secs); };

  useEffect(() => () => clear(), []);

  const pct = totalSeconds > 0 ? (remaining / totalSeconds) * 100 : 0;
  const mm  = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss  = String(remaining % 60).padStart(2, "0");

  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className="widget items-center gap-4">
      <p className="widget-title self-start">FOCUS TIMER</p>

      <div className="relative w-28 h-28">
        <svg className="w-28 h-28 -rotate-90" viewBox="0 0 88 88">
          <circle cx="44" cy="44" r={r} fill="none" stroke="#2a2a2a" strokeWidth="6" />
          <circle
            cx="44" cy="44" r={r} fill="none"
            stroke="#7B2FBE" strokeWidth="6"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 0.5s linear" }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-mono text-xl font-bold">
          {mm}:{ss}
        </span>
      </div>

      <div className="flex gap-2">
        {PRESETS.map(p => (
          <button
            key={p.label}
            onClick={() => reset(p.seconds)}
            className={`text-xs px-2 py-1 rounded-lg border transition-colors ${
              totalSeconds === p.seconds
                ? "border-accent text-accent"
                : "border-card-border text-gray-400 hover:border-accent-light"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        {running ? (
          <button onClick={pause} className="btn-accent px-6">Pause</button>
        ) : (
          <button onClick={start} className="btn-accent px-6" disabled={remaining === 0}>
            {remaining === totalSeconds ? "Start" : "Resume"}
          </button>
        )}
        <button
          onClick={() => reset(totalSeconds)}
          className="text-xs px-4 py-1.5 rounded-lg border border-card-border text-gray-400 hover:border-gray-500 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
