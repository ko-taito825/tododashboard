"use client";
import { useCallback, useEffect, useState } from "react";
import { createTask, deleteTask, getTasks, updateTask } from "@/lib/api";
import type { Task } from "@/types";

const EV = "tasks-changed";
const notify = () => window.dispatchEvent(new CustomEvent(EV));

function getWeekStart() {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d);
  monday.setDate(diff);
  return monday.toISOString().slice(0, 10);
}

export default function WeeklyTask() {
  const [tasks, setTasks]     = useState<Task[]>([]);
  const [adding, setAdding]   = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const load = useCallback(async () => {
    const data = await getTasks("week", { week_start: getWeekStart(), task_category: "1" });
    setTasks(data);
  }, []);

  useEffect(() => { load(); }, [load]);

  // Reload when another component mutates tasks
  useEffect(() => {
    window.addEventListener(EV, load);
    return () => window.removeEventListener(EV, load);
  }, [load]);

  const add = async () => {
    if (!newTitle.trim()) return;
    const today = new Date().toISOString().slice(0, 10);
    const t = await createTask({ title: newTitle.trim(), due_date: today, is_completed: false, task_category: "scheduled" });
    setTasks(prev => [...prev, t]);
    setNewTitle(""); setAdding(false);
    notify();
  };

  const toggle = async (task: Task) => {
    try {
      const updated = await updateTask(task.id, { is_completed: !task.is_completed });
      setTasks(prev => prev.map(t => t.id === task.id ? updated : t));
      notify();
    } catch {
      // Task deleted by another component — remove from local state
      setTasks(prev => prev.filter(t => t.id !== task.id));
    }
  };

  const remove = async (id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    try {
      await deleteTask(id);
      notify();
    } catch {
      load();
    }
  };

  return (
    <div className="data-card flex flex-col h-40">
      <p className="text-accent text-xs font-bold text-center tracking-widest mb-2">Weekly Task</p>

      <ul className="flex flex-col gap-1 flex-1 overflow-y-auto">
        {tasks.map(task => (
          <li key={task.id} className="flex items-center gap-2 group cursor-pointer" onClick={() => toggle(task)}>
            <span className="text-gray-500 text-sm">📄</span>
            <span className={`text-xs flex-1 ${task.is_completed ? "line-through text-gray-600" : "text-accent"}`}>
              {task.title}
            </span>
            <button
              onClick={e => { e.stopPropagation(); remove(task.id); }}
              className="opacity-0 group-hover:opacity-100 text-gray-700 hover:text-red-400 text-xs transition-all"
            >✕</button>
          </li>
        ))}
        {tasks.length === 0 && !adding && (
          <li className="text-gray-700 text-xs">タスクなし</li>
        )}
      </ul>

      {adding ? (
        <div className="flex gap-1.5 mt-1">
          <input
            autoFocus value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") add(); if (e.key === "Escape") setAdding(false); }}
            placeholder="タスク名"
            className="flex-1 text-xs border-b border-accent/40 text-white placeholder-gray-700 py-0.5"
          />
          <button onClick={add} className="text-xs text-accent">追加</button>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="add-btn mt-1">
          <span className="text-base leading-none">+</span>
          <span className="text-xs">Add Task</span>
        </button>
      )}
    </div>
  );
}
