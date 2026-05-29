"use client";
import { useCallback, useEffect, useState } from "react";
import { createHabit, deleteHabit, getHabitLogs, getHabits, upsertHabitLog } from "@/lib/api";
import type { Habit, HabitLog } from "@/types";

interface Props {
  category: "morning_routine" | "night_routine";
  title: string;
  icon: "sun" | "moon";
}

export default function RoutineWidget({ category, title, icon }: Props) {
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
    <div>
      {/* Section header */}
      <div className="section-header">
        <span className="text-sm">{icon === "sun" ? "☀" : "🌙"}</span>
        <span className="section-title">{title}</span>
      </div>

      {/* Habit list */}
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
            onKeyDown={e => { if (e.key === "Enter") add(); if (e.key === "Escape") setAdding(false); }}
            placeholder="To-do"
            className="flex-1 text-xs border-b border-accent/40 text-white placeholder-gray-700 py-0.5"
          />
          <button onClick={add} className="text-xs text-accent">追加</button>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="add-btn">
          <span className="text-base leading-none">+</span>
          <span className="text-xs">Add To-do</span>
        </button>
      )}
    </div>
  );
}
