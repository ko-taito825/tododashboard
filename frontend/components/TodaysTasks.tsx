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
    const data = await getTasks("today");
    setTasks(data);
  }, []);

  useEffect(() => { load(); }, [load]);

  const add = async () => {
    if (!newTitle.trim()) return;
    const t = await createTask({ title: newTitle.trim(), due_date: today, is_completed: false });
    setTasks(prev => [...prev, t]);
    setNewTitle("");
    setAdding(false);
  };

  const toggle = async (task: Task) => {
    const updated = await updateTask(task.id, { is_completed: !task.is_completed });
    setTasks(prev => prev.map(t => t.id === task.id ? updated : t));
  };

  const remove = async (id: number) => {
    await deleteTask(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const done  = tasks.filter(t => t.is_completed).length;
  const total = tasks.length;

  return (
    <div className="widget h-full">
      <div className="flex items-center justify-between">
        <p className="widget-title">TODAY&apos;S TASKS</p>
        <span className="text-xs text-accent font-semibold">{done}/{total}</span>
      </div>

      {total > 0 && (
        <div className="w-full bg-card-border rounded-full h-1">
          <div
            className="bg-accent h-1 rounded-full transition-all"
            style={{ width: total > 0 ? `${(done / total) * 100}%` : "0%" }}
          />
        </div>
      )}

      <div className="flex flex-col flex-1 overflow-y-auto">
        {tasks.map(task => (
          <div key={task.id} className="check-item group">
            <button
              onClick={() => toggle(task)}
              className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                task.is_completed ? "bg-accent border-accent" : "border-gray-600 hover:border-accent"
              }`}
            >
              {task.is_completed && (
                <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
                  <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
            <span className={`text-sm flex-1 ${task.is_completed ? "line-through text-gray-500" : "text-gray-200"}`}>
              {task.title}
            </span>
            <button
              onClick={() => remove(task.id)}
              className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all text-xs px-1"
            >
              ✕
            </button>
          </div>
        ))}
        {tasks.length === 0 && !adding && (
          <p className="text-xs text-gray-600 py-2">今日のタスクはありません</p>
        )}
      </div>

      {adding ? (
        <div className="flex gap-2">
          <input
            autoFocus value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") add(); if (e.key === "Escape") setAdding(false); }}
            placeholder="タスク名"
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
