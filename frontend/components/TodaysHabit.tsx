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
    const log = logs.find(l => l.habit_id === habit.id);
    const next = !(log?.is_completed ?? false);
    const updated = await upsertHabitLog(habit.id, today, next);
    setLogs(prev => [...prev.filter(l => l.habit_id !== habit.id), updated]);
  };

  const add = async () => {
    if (!newName.trim()) return;
    const h = await createHabit({ name: newName.trim(), category: "general" });
    setHabits(prev => [...prev, h]);
    setNewName("");
    setAdding(false);
  };

  const remove = async (id: number) => {
    await deleteHabit(id);
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const isCompleted = (h: Habit) => logs.find(l => l.habit_id === h.id)?.is_completed ?? false;
  const doneCount = habits.filter(isCompleted).length;

  return (
    <div className="widget">
      <div className="flex items-center justify-between">
        <p className="widget-title">TODAY&apos;S HABIT</p>
        <span className="text-xs text-accent font-semibold">{doneCount}/{habits.length}</span>
      </div>

      <div className="flex flex-col">
        {habits.map(habit => (
          <div key={habit.id} className="check-item group">
            <button
              onClick={() => toggle(habit)}
              className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
                isCompleted(habit) ? "bg-accent border-accent" : "border-gray-600 hover:border-accent"
              }`}
            >
              {isCompleted(habit) && <div className="w-2 h-2 rounded-full bg-white" />}
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
        {habits.length === 0 && (
          <p className="text-xs text-gray-600 py-2">習慣を追加しましょう</p>
        )}
      </div>

      {adding ? (
        <div className="flex gap-2">
          <input
            autoFocus value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") add(); if (e.key === "Escape") setAdding(false); }}
            placeholder="習慣名"
            className="flex-1 text-sm bg-card-border/30 border border-card-border rounded px-2 py-1 text-white placeholder-gray-600"
          />
          <button onClick={add} className="btn-accent">追加</button>
          <button onClick={() => setAdding(false)} className="text-xs text-gray-500">✕</button>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="text-xs text-gray-500 hover:text-accent transition-colors text-left">
          + Add Task
        </button>
      )}
    </div>
  );
}
