"use client";
import { useEffect, useState } from "react";

type Review = { id: number; week_start: string; content: string };

function getLastMondayStr(): string {
  const today = new Date();
  const lastMonday = new Date(today);
  lastMonday.setDate(today.getDate() - 7);
  // normalize to Monday
  const dow = lastMonday.getDay();
  lastMonday.setDate(lastMonday.getDate() - ((dow + 6) % 7));
  return lastMonday.toISOString().slice(0, 10);
}

export default function WeeklyReviewBanner() {
  const [review, setReview] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const today = new Date();
    if (today.getDay() !== 1) return; // 月曜のみ

    const weekStart = getLastMondayStr();
    const dismissKey = `wr-dismissed-${weekStart}`;
    if (sessionStorage.getItem(dismissKey)) return;

    fetch("/api/weekly-review")
      .then(r => r.json())
      .then((reviews: Review[]) => {
        const existing = reviews.find(r => r.week_start === weekStart);
        if (existing) {
          setReview(existing.content);
          setVisible(true);
        } else {
          setGenerating(true);
          return fetch("/api/weekly-review", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ week_start: weekStart }),
          })
            .then(r => r.json())
            .then((data: Review) => {
              setReview(data.content);
              setVisible(true);
              setGenerating(false);
            })
            .catch(() => setGenerating(false));
        }
      })
      .catch(() => {});
  }, []);

  const dismiss = () => {
    const weekStart = getLastMondayStr();
    sessionStorage.setItem(`wr-dismissed-${weekStart}`, "1");
    setVisible(false);
  };

  if (generating) {
    return (
      <div className="mx-12 mb-4 border border-[#3a2a50] rounded-lg p-3 bg-[#0a0818]/60 flex items-center gap-2">
        <span className="text-accent text-xs animate-pulse">🤖 週次AIレビューを生成中...</span>
      </div>
    );
  }

  if (!visible || !review) return null;

  return (
    <div className="mx-12 mb-4 border border-[#7B2FBE] rounded-lg p-4 bg-[#1a0a2e]/60 flex items-start gap-3">
      <div className="flex-1">
        <p className="text-xs text-accent font-black tracking-widest mb-1.5">🤖 週次AIレビュー</p>
        <p className="text-sm text-gray-200 leading-relaxed">{review}</p>
      </div>
      <button
        onClick={dismiss}
        className="text-gray-600 hover:text-white transition-colors text-sm shrink-0 mt-0.5"
      >✕</button>
    </div>
  );
}
