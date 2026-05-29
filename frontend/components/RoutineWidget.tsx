"use client";
import { useCallback, useEffect, useState } from "react";
import { createHabit, deleteHabit, getHabitLogs, getHabits, upsertHabitLog } from "@/lib/api";
import type { Habit, HabitLog } from "@/types";

interface Props {
  category: "morning_routine" | "night_routine";
  title: string;
}

export default function RoutineWidget({ category, title }: Props) {
  const [habits, setHabits]   = useState<Habit[]>([]);
  const [logs, setLogs]       = useState<HabitLog[]>([]);
  const [adding, setAdding]   = useState(false);
  const [newName, setNewName] = useState("");
  const today = new Date().toISOString().slice(0, 10);

  const fetchAll = useCallback(async () => {
    const [h, rawLogs] = await Promise.all([
      getHabits(category),
      getHabitLogs(today).catch(() => []),
    ]);
    setHabits(h);
    setLogs(rawLogs);
  }, [category, today]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const toggle = async (habit: Habit) => {
    const log = logs.find(l => l.habit_id === habit.id);
    const next = !(log?.is_completed ?? false);
    const updated = await upsertHabitLog(habit.id, today, next);
    setLogs(prev => {
      const others = prev.filter(l => l.habit_id !== habit.id);
      return [...others, updated];
    });
  };

  const add = async () => {
    if (!newName.trim()) return;
    const h = await createHabit({ name: newName.trim(), category });
    setHabits(prev => [...prev, h]);
    setNewName("");
    setAdding(false);
  };

  const remove = async (id: number) => {
    await deleteHabit(id);
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const isCompleted = (habit: Habit) =>
    logs.find(l => l.habit_id === habit.id)?.is_completed ?? false;

  const doneCount = habits.filter(isCompleted).length;

  return (
    <div className="widget">
      <div className="flex items-center justify-between">
        <p className="widget-title">{title}</p>
        <span className="text-xs text-accent font-semibold">
          {doneCount}/{habits.length}
        </span>
      </div>

      <div className="flex flex-col gap-0">
        {habits.map(habit => (
          <div key={habit.id} className="check-item group">
            <button
              onClick={() => toggle(habit)}
              className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                isCompleted(habit)
                  ? "bg-accent border-accent"
                  : "border-gray-600 hover:border-accent"
              }`}
            >
              {isCompleted(habit) && (
                <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
                  <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
            <span className={`text-sm flex-1 ${isCompleted(habit) ? "line-through text-gray-500" : "text-gray-200"}`}>
              {habit.name}
            </span>
            <button
              onClick={() => remove(habit.id)}
              className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all text-xs px-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {adding ? (
        <div className="flex gap-2 mt-1">
          <input
            autoFocus
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") add(); if (e.key === "Escape") setAdding(false); }}
            placeholder="タスク名"
            className="flex-1 text-sm bg-card-border/30 border border-card-border rounded px-2 py-1 text-white placeholder-gray-600"
          />
          <button onClick={add} className="btn-accent">追加</button>
          <button onClick={() => setAdding(false)} className="text-xs text-gray-500">キャンセル</button>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="text-xs text-gray-500 hover:text-accent transition-colors text-left mt-1"
        >
          + Add Task
        </button>
      )}
    </div>
  );
}
