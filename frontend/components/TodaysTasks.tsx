"use client";
import { useCallback, useEffect, useState } from "react";
import { createTask, deleteTask, getTasks, updateTask } from "@/lib/api";
import type { Task } from "@/types";

export default function TodaysTasks() {
  const [tasks, setTasks]     = useState<Task[]>([]);
  const [adding, setAdding]   = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const today = new Date().toISOString().slice(0, 10);

  const load = useCallback(async () => {
    const data = await getTasks("today", { task_category: "0" });
    setTasks(data);
  }, []);

  useEffect(() => { load(); }, [load]);

  const add = async () => {
    if (!newTitle.trim()) return;
    const t = await createTask({ title: newTitle.trim(), due_date: today, is_completed: false, task_category: "daily" });
    setTasks(prev => [...prev, t]);
    setNewTitle("");
    setAdding(false);
  };

  const toggle = async (task: Task) => {
    try {
      const updated = await updateTask(task.id, { is_completed: !task.is_completed });
      setTasks(prev => prev.map(t => t.id === task.id ? updated : t));
    } catch {
      setTasks(prev => prev.filter(t => t.id !== task.id));
    }
  };

  const remove = async (id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    try {
      await deleteTask(id);
    } catch {
      load();
    }
  };

  const done  = tasks.filter(t => t.is_completed).length;
  const total = tasks.length;

  return (
    <div>
      <div className="section-header">
        <span className="text-sm">📅</span>
        <span className="section-title">Today&apos;s Tasks</span>
      </div>

      <ul className="flex flex-col gap-0.5 mb-2">
        {tasks.map(task => (
          <li key={task.id} className="bullet-item group" onClick={() => toggle(task)}>
            <span className={`text-base leading-none ${task.is_completed ? "text-accent" : "text-gray-500"}`}>•</span>
            <span className={`flex-1 text-sm ${task.is_completed ? "line-through text-gray-500" : "text-gray-300"}`}>
              {task.title}
            </span>
            <button
              onClick={e => { e.stopPropagation(); remove(task.id); }}
              className="opacity-0 group-hover:opacity-100 text-gray-700 hover:text-red-400 text-xs transition-all"
            >✕</button>
          </li>
        ))}
      </ul>

      {adding ? (
        <div className="flex gap-1.5">
          <input
            autoFocus value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={e => { if (e.isComposing || e.nativeEvent.isComposing) return; if (e.key === "Enter") add(); if (e.key === "Escape") setAdding(false); }}
            placeholder="タスク名"
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
