"use client";
import { useCallback, useEffect, useRef, useState } from "react";

const PRESETS = [
  { label: "15min", seconds: 15 * 60 },
  { label: "30min", seconds: 30 * 60 },
  { label: "1hour", seconds: 60 * 60 },
];

/** フラッシュオーバーレイ: フェードイン → クリックするまで表示 → フェードアウト */
function TimerFlash({ onDismiss }: { onDismiss: () => void }) {
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 600); // フェードイン完了
    return () => clearTimeout(t1);
  }, []);

  const dismiss = () => {
    setPhase("out");
    setTimeout(() => onDismiss(), 600); // フェードアウト完了後に消す
  };

  const opacity =
    phase === "in"   ? "opacity-0 animate-[fadeIn_0.6s_ease_forwards]"
    : phase === "hold" ? "opacity-70"
    : "opacity-0 transition-opacity duration-[600ms]";

  return (
    <div
      className={`fixed inset-0 z-50 cursor-pointer ${opacity}`}
      style={{ backgroundColor: "#7B2FBE" }}
      onClick={dismiss}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none">
        <p className="text-white text-5xl font-black tracking-widest">TIME&apos;S UP</p>
        <p className="text-white/70 text-sm tracking-widest">クリックして閉じる</p>
      </div>
    </div>
  );
}

export default function TimerWidget() {
  const [totalSeconds, setTotalSeconds] = useState(PRESETS[0].seconds);
  const [remaining, setRemaining]       = useState(PRESETS[0].seconds);
  const [running, setRunning]           = useState(false);
  const [flash, setFlash]               = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = () => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  };

  const start = useCallback(() => {
    if (remaining === 0) return;
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clear();
          setRunning(false);
          setFlash(true); // タイマー終了 → フラッシュ発動
          return 0;
        }
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
    <>
      {/* 終了フラッシュオーバーレイ */}
      {flash && <TimerFlash onDismiss={() => setFlash(false)} />}

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
    </>
  );
}
