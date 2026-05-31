"use client";
import { useEffect, useState } from "react";
import { getDailyMemo, getHabitLogs, getHabits, getTasks } from "@/lib/api";
import type { DailyMemo, Habit, HabitLog, Task } from "@/types";

interface DayData {
  morningHabits: Habit[];
  nightHabits:   Habit[];
  generalHabits: Habit[];
  logs:          HabitLog[];
  tasks:         Task[];
  memo:          DailyMemo;
}

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-1.5 pb-1 border-b border-accent/30 mb-3">
      <span className="text-sm">{icon}</span>
      <span className="text-accent text-xs font-bold tracking-widest uppercase">{title}</span>
    </div>
  );
}

function HabitList({ habits, logs }: { habits: Habit[]; logs: HabitLog[] }) {
  if (habits.length === 0) return <p className="text-gray-600 text-xs">データなし</p>;
  return (
    <ul className="flex flex-col gap-1">
      {habits.map(h => {
        const log  = logs.find(l => l.habit_id === h.id);
        const done = log?.is_completed ?? false;
        return (
          <li key={h.id} className="flex items-center gap-2 text-sm">
            <span className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center ${
              done ? "bg-accent border-accent" : "border-gray-600"
            }`}>
              {done && (
                <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
                  <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </span>
            <span className={done ? "line-through text-gray-500" : "text-gray-300"}>{h.name}</span>
          </li>
        );
      })}
    </ul>
  );
}

function TaskList({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) return <p className="text-gray-600 text-xs">タスクなし</p>;
  return (
    <ul className="flex flex-col gap-1">
      {tasks.map(t => (
        <li key={t.id} className="flex items-center gap-2 text-sm">
          <span className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center ${
            t.is_completed ? "bg-accent border-accent" : "border-gray-600"
          }`}>
            {t.is_completed && (
              <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
                <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </span>
          <span className={t.is_completed ? "line-through text-gray-500" : "text-gray-300"}>{t.title}</span>
        </li>
      ))}
    </ul>
  );
}

export default function DayDetail({ date }: { date: string }) {
  const [data, setData]       = useState<DayData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setData(null);

    Promise.all([
      getHabits("morning_routine"),
      getHabits("night_routine"),
      getHabits("general"),
      getHabitLogs(date),
      getTasks("today", { date }),
      getDailyMemo(date),
    ]).then(([morning, night, general, logs, tasks, memo]) => {
      if (!cancelled) {
        setData({
          morningHabits: morning,
          nightHabits:   night,
          generalHabits: general,
          logs,
          tasks,
          memo: memo as DailyMemo,
        });
        setLoading(false);
      }
    }).catch(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [date]);

  const fmt = new Date(date + "T00:00:00").toLocaleDateString("ja-JP", {
    year: "numeric", month: "long", day: "numeric", weekday: "long",
  });

  const doneTasks   = data?.tasks.filter(t => t.is_completed).length ?? 0;
  const totalTasks  = data?.tasks.length ?? 0;
  const allHabits   = [...(data?.morningHabits ?? []), ...(data?.nightHabits ?? []), ...(data?.generalHabits ?? [])];
  const doneHabits  = allHabits.filter(h => data?.logs.find(l => l.habit_id === h.id)?.is_completed).length;
  const totalHabits = allHabits.length;

  return (
    <div className="flex flex-col gap-6">
      {/* Date header */}
      <div className="flex items-end justify-between border-b border-gray-800 pb-4">
        <h2 className="text-xl font-bold text-white">{fmt}</h2>
        {data && (
          <div className="flex gap-4 text-xs text-gray-400">
            <span>タスク <span className="text-accent font-bold">{doneTasks}/{totalTasks}</span></span>
            <span>習慣 <span className="text-accent font-bold">{doneHabits}/{totalHabits}</span></span>
          </div>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16 text-gray-600">読み込み中...</div>
      )}

      {data && (
        <div className="grid grid-cols-2 gap-6">
          {/* Left column */}
          <div className="flex flex-col gap-6">
            <div>
              <SectionHeader icon="☀" title="Morning Routine" />
              <HabitList habits={data.morningHabits} logs={data.logs} />
            </div>
            <div>
              <SectionHeader icon="🌙" title="Night Routine" />
              <HabitList habits={data.nightHabits} logs={data.logs} />
            </div>
            <div>
              <SectionHeader icon="📅" title="Today's Habit" />
              <HabitList habits={data.generalHabits} logs={data.logs} />
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6">
            <div>
              <SectionHeader icon="📋" title="Today's Tasks" />
              <TaskList tasks={data.tasks} />
            </div>
            <div>
              <SectionHeader icon="📝" title="Memo" />
              {data.memo.content ? (
                <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {data.memo.content}
                </p>
              ) : (
                <p className="text-gray-600 text-xs">メモなし</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
