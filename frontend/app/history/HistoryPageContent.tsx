"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DayDetail from "@/components/history/DayDetail";
import HistoryCalendar from "@/components/history/HistoryCalendar";
import UserMenu from "@/components/UserMenu";
import type { WeeklyReview } from "@/types";

export default function HistoryPageContent() {
  const searchParams  = useSearchParams();
  const router        = useRouter();
  const selectedDate  = searchParams.get("date") ?? new Date().toISOString().slice(0, 10);

  const [reviews, setReviews] = useState<WeeklyReview[]>([]);

  useEffect(() => {
    fetch("/api/weekly-review")
      .then(r => r.json())
      .then(setReviews)
      .catch(() => {});
  }, []);

  const selectDate = (date: string) => {
    router.push(`/history?date=${date}`, { scroll: false });
  };

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-white">

      {/* Header */}
      <header className="px-12 pt-6 pb-4 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-gray-500 hover:text-accent transition-colors text-sm flex items-center gap-1"
          >
            ← Dashboard
          </Link>
          <h1 className="text-2xl font-black tracking-[0.3em] text-white">HISTORY</h1>
        </div>
        <UserMenu />
      </header>

      {/* Weekly Reviews Section */}
      {reviews.length > 0 && (
        <section id="reviews" className="px-12 pt-8">
          <p className="text-xs font-black tracking-widest text-gray-500 mb-4">WEEKLY AI REVIEW</p>
          <div className="grid grid-cols-2 gap-4">
            {reviews.map(r => (
              <div
                key={r.id}
                className="border border-[#7B2FBE] rounded-xl p-5 bg-[#1a0a2e]/50"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-accent text-xs font-black tracking-widest">🤖 AI REVIEW</span>
                  <span className="text-gray-600 text-xs ml-auto">{r.week_start} 週</span>
                </div>
                <p className="text-sm text-gray-200 leading-relaxed">{r.content}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Main layout */}
      <div className="flex gap-8 px-12 pt-8 pb-12 items-start">

        {/* Calendar — sticky */}
        <div className="w-72 shrink-0 sticky top-8">
          <HistoryCalendar selectedDate={selectedDate} onSelectDate={selectDate} />
        </div>

        {/* Day detail */}
        <div className="flex-1 min-w-0">
          <DayDetail date={selectedDate} />
        </div>
      </div>
    </div>
  );
}
