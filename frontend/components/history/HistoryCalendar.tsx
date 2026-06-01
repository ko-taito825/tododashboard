"use client";
import { useState } from "react";

const MONTHS   = ["January","February","March","April","May","June",
                  "July","August","September","October","November","December"];
const WEEKDAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

interface Props {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

function buildCalendar(year: number, month: number) {
  const first   = new Date(year, month - 1, 1);
  const last    = new Date(year, month, 0);
  const startDow = first.getDay();
  const days: (number | null)[] = [
    ...Array(startDow).fill(null),
    ...Array.from({ length: last.getDate() }, (_, i) => i + 1),
  ];
  while (days.length % 7 !== 0) days.push(null);
  return days;
}

export default function HistoryCalendar({ selectedDate, onSelectDate }: Props) {
  const today = new Date();
  const [view, setView] = useState({
    year:  today.getFullYear(),
    month: today.getMonth() + 1,
  });

  const todayStr = today.toISOString().slice(0, 10);
  const days     = buildCalendar(view.year, view.month);

  const prev = () => setView(v => ({
    year:  v.month === 1  ? v.year - 1 : v.year,
    month: v.month === 1  ? 12 : v.month - 1,
  }));
  const next = () => setView(v => ({
    year:  v.month === 12 ? v.year + 1 : v.year,
    month: v.month === 12 ? 1  : v.month + 1,
  }));

  return (
    <div className="bg-[#0f0a1a] border border-[#2a2a2a] rounded-xl p-5">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prev} className="text-gray-400 hover:text-white px-2 text-xl transition-colors">‹</button>
        <span className="font-bold text-white tracking-wide">
          {MONTHS[view.month - 1]} {view.year}
        </span>
        <button onClick={next} className="text-gray-400 hover:text-white px-2 text-xl transition-colors">›</button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((d, i) => (
          <div key={d} className={`text-center text-xs font-semibold py-1 ${
            i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-gray-500"
          }`}>
            {d}
          </div>
        ))}
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => {
          if (!day) return <div key={`e-${idx}`} className="h-10" />;

          const dateStr    = `${view.year}-${String(view.month).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
          const isSelected = dateStr === selectedDate;
          const isToday    = dateStr === todayStr;
          const isFuture   = dateStr > todayStr;
          const col        = idx % 7;

          return (
            <button
              key={dateStr}
              onClick={() => !isFuture && onSelectDate(dateStr)}
              disabled={isFuture}
              className={`h-10 w-full rounded-lg text-sm font-semibold transition-colors ${
                isSelected
                  ? "bg-accent text-white"
                  : isToday
                    ? "border border-accent text-accent hover:bg-accent/20"
                    : isFuture
                      ? "text-gray-700 cursor-not-allowed"
                      : col === 0
                        ? "text-red-300 hover:bg-[#1a0a2e] hover:text-white"
                        : col === 6
                          ? "text-blue-300 hover:bg-[#1a0a2e] hover:text-white"
                          : "text-gray-300 hover:bg-[#1a0a2e] hover:text-white"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
