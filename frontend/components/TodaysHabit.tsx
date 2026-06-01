"use client";
import { useCallback, useEffect, useState } from "react";
import { createHabit, deleteHabit, getHabitLogs, getHabits, upsertHabitLog } from "@/lib/api";
import type { Habit, HabitLog } from "@/types";

export default function TodaysHabit() {
  const [habits, setHabits]   = useState<Habit[]>([]);
  const [logs, setLogs]       = useState<HabitLog[]>([]);
  const [adding, setAdding]   = useState(false);
  const [newName, setNewName] = useState("");
  const today = new Date().toISOString().slice(0, 10);

  const fetchAll = useCallback(async () => {
    const h = await getHabits("general");
    setHabits(h);
    if (h.length > 0) {
      const allLogs: HabitLog[] = await getHabitLogs(today).catch(() => []);
      const habitIds = new Set(h.map(x => x.id));
      setLogs(allLogs.filter(l => habitIds.has(l.habit_id)));
    }
  }, [today]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const toggle = async (habit: Habit) => {
    const next = !(logs.find(l => l.habit_id === habit.id)?.is_completed ?? false);
    const updated = await upsertHabitLog(habit.id, today, next);
    setLogs(prev => [...prev.filter(l => l.habit_id !== habit.id), updated]);
  };

  const add = async () => {
    if (!newName.trim()) return;
    const h = await createHabit({ name: newName.trim(), category: "general" });
    setHabits(prev => [...prev, h]);
    setNewName(""); setAdding(false);
  };

  const remove = async (id: number) => {
    await deleteHabit(id);
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const isCompleted = (h: Habit) => logs.find(l => l.habit_id === h.id)?.is_completed ?? false;

  return (
    <div>
      <div className="section-header">
        <span className="text-sm">📅</span>
        <span className="section-title">Today&apos;s Habit</span>
      </div>

      <ul className="flex flex-col gap-0.5 mb-2">
        {habits.map(habit => (
          <li key={habit.id} className="bullet-item group" onClick={() => toggle(habit)}>
            <span className={`text-base leading-none ${isCompleted(habit) ? "text-accent" : "text-gray-500"}`}>•</span>
            <span className={`flex-1 text-sm ${isCompleted(habit) ? "line-through text-gray-500" : "text-gray-300"}`}>
              {habit.name}
            </span>
            <button
              onClick={e => { e.stopPropagation(); remove(habit.id); }}
              className="opacity-0 group-hover:opacity-100 text-gray-700 hover:text-red-400 text-xs transition-all"
            >✕</button>
          </li>
        ))}
      </ul>

      {adding ? (
        <div className="flex gap-1.5">
          <input
            autoFocus value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => { if (e.isComposing || e.nativeEvent.isComposing) return; if (e.key === "Enter") add(); if (e.key === "Escape") setAdding(false); }}
            placeholder="習慣名"
            className="flex-1 text-xs border-b border-accent/40 text-white placeholder-gray-700 py-0.5"
          />
          <button onClick={add} className="text-xs text-accent">追加</button>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="add-btn">
          <span className="text-accent text-lg font-bold leading-none">⊕</span>
          <span className="text-sm text-gray-400">Add Habit</span>
        </button>
      )}
    </div>
  );
}
