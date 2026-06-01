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

function Check({ done }: { done: boolean }) {
  return (
    <span className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
      done ? "bg-accent border-accent" : "border-gray-600"
    }`}>
      {done && (
        <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
          <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}

function Card({ icon, title, badge, children }: {
  icon: string; title: string; badge?: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-[#0f0a1a] border border-[#2a2a2a] rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between pb-2 border-b border-accent/20">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{icon}</span>
          <span className="text-accent text-xs font-bold tracking-widest uppercase">{title}</span>
        </div>
        {badge && <span className="text-xs text-gray-500 font-semibold">{badge}</span>}
      </div>
      {children}
    </div>
  );
}

function HabitList({ habits, logs }: { habits: Habit[]; logs: HabitLog[] }) {
  if (habits.length === 0) return <p className="text-gray-600 text-xs py-1">データなし</p>;
  const done = habits.filter(h => logs.find(l => l.habit_id === h.id)?.is_completed).length;
  return (
    <>
      <ul className="flex flex-col gap-2">
        {habits.map(h => {
          const isDone = logs.find(l => l.habit_id === h.id)?.is_completed ?? false;
          return (
            <li key={h.id} className="flex items-center gap-2 text-sm">
              <Check done={isDone} />
              <span className={isDone ? "line-through text-gray-500" : "text-gray-200"}>{h.name}</span>
            </li>
          );
        })}
      </ul>
      <p className="text-xs text-gray-600 text-right mt-auto">{done}/{habits.length} 完了</p>
    </>
  );
}

function TaskList({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) return <p className="text-gray-600 text-xs py-1">タスクなし</p>;
  return (
    <ul className="flex flex-col gap-2">
      {tasks.map(t => (
        <li key={t.id} className="flex items-center gap-2 text-sm">
          <Check done={t.is_completed} />
          <span className={t.is_completed ? "line-through text-gray-500" : "text-gray-200"}>{t.title}</span>
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
      getTasks("today", { date }), // no task_category → all categories
      getDailyMemo(date),
    ]).then(([morning, night, general, logs, tasks, memo]) => {
      if (!cancelled) {
        setData({ morningHabits: morning, nightHabits: night, generalHabits: general, logs, tasks, memo: memo as DailyMemo });
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

  return (
    <div className="flex flex-col gap-5">

      {/* Date header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-800">
        <h2 className="text-xl font-bold text-white">{fmt}</h2>
        {data && (
          <div className="flex gap-3">
            <span className="text-xs bg-[#1a0a2e] border border-accent/30 rounded-full px-3 py-1 text-gray-300">
              タスク <span className="text-accent font-bold">{doneTasks}/{totalTasks}</span>
            </span>
            <span className="text-xs bg-[#1a0a2e] border border-accent/30 rounded-full px-3 py-1 text-gray-300">
              習慣 <span className="text-accent font-bold">{doneHabits}/{allHabits.length}</span>
            </span>
          </div>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20 text-gray-600">読み込み中...</div>
      )}

      {data && (
        <>
          {/* Row 1: Routines + Habit (3 cols) */}
          <div className="grid grid-cols-3 gap-4">
            <Card icon="☀" title="Morning Routine">
              <HabitList habits={data.morningHabits} logs={data.logs} />
            </Card>
            <Card icon="🌙" title="Night Routine">
              <HabitList habits={data.nightHabits} logs={data.logs} />
            </Card>
            <Card icon="📅" title="Today's Habit">
              <HabitList habits={data.generalHabits} logs={data.logs} />
            </Card>
          </div>

          {/* Row 2: Tasks + Memo (2 cols) */}
          <div className="grid grid-cols-2 gap-4">
            <Card
              icon="📋"
              title="Today's Tasks"
              badge={totalTasks > 0 ? `${doneTasks}/${totalTasks}` : undefined}
            >
              <TaskList tasks={data.tasks} />
            </Card>
            <Card icon="📝" title="Memo">
              {data.memo.content ? (
                <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {data.memo.content}
                </p>
              ) : (
                <p className="text-gray-600 text-xs py-1">メモなし</p>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
