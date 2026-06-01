"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import DayDetail from "@/components/history/DayDetail";
import HistoryCalendar from "@/components/history/HistoryCalendar";
import UserMenu from "@/components/UserMenu";

export default function HistoryPageContent() {
  const searchParams  = useSearchParams();
  const router        = useRouter();
  const selectedDate  = searchParams.get("date") ?? new Date().toISOString().slice(0, 10);

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
