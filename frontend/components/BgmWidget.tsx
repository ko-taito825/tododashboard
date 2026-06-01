"use client";
import { useState } from "react";

const BGM_OPTIONS = [
  { label: "Brown Noise", videoId: "RqzGzwTY-6w" },
  { label: "White Noise", videoId: "nMfPqeZjc2c" },
  { label: "LoFi Hip Hop", videoId: "jfKfPfyJRdk" },
  { label: "Nature",       videoId: "q76bMs-NwRk" },
];

export default function BgmWidget() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const toggle = (videoId: string) => {
    setActiveId(prev => (prev === videoId ? null : videoId));
  };

  return (
    <div className="border border-[#3a2a50] rounded-xl p-4 bg-[#0a0818]/60">
      <p className="text-xs font-black tracking-widest text-gray-400 mb-3">BGM</p>
      <div className="flex flex-col gap-1.5">
        {BGM_OPTIONS.map(opt => (
          <button
            key={opt.videoId}
            onClick={() => toggle(opt.videoId)}
            className={`text-xs py-1.5 px-3 rounded border transition-all text-left ${
              activeId === opt.videoId
                ? "border-accent bg-accent/20 text-accent font-semibold"
                : "border-[#3a2a50] text-gray-400 hover:border-accent/50 hover:text-gray-200"
            }`}
          >
            <span className="mr-1.5">{activeId === opt.videoId ? "▶" : "○"}</span>
            {opt.label}
          </button>
        ))}
      </div>

      {/* Hidden YouTube iframe for audio — positioned off-screen (not display:none to allow autoplay) */}
      {activeId && (
        <iframe
          key={activeId}
          src={`https://www.youtube.com/embed/${activeId}?autoplay=1&loop=1&playlist=${activeId}`}
          allow="autoplay"
          title="BGM"
          style={{
            position: "fixed",
            top: "-1px",
            left: "-1px",
            width: "1px",
            height: "1px",
            opacity: 0,
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}
