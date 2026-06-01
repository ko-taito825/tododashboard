"use client";
import { useMemo } from "react";

const QUOTES: string[] = [
  // 名言はここに追加
];

export default function QuoteWidget() {
  const quote = useMemo(() => {
    if (QUOTES.length === 0) return null;
    return QUOTES[Math.floor(Math.random() * QUOTES.length)];
  }, []);

  if (!quote) return null;

  return (
    <div className="px-12 py-3 border-t border-[#1a1a1a]">
      <p className="text-sm text-gray-500 italic text-center tracking-wide">{quote}</p>
    </div>
  );
}
