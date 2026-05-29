"use client";
import { useCallback, useEffect, useState } from "react";
import { createTask, deleteTask, getTasks, updateTask } from "@/lib/api";
import type { Task } from "@/types";

function getWeekDates(baseDate = new Date()) {
  const d = new Date(baseDate);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return date;
  });
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function WeeklyTask() {
  const [tasks, setTasks]     = useState<Task[]>([]);
  const [adding, setAdding]   = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const weekDates = getWeekDates();
  const todayStr = new Date().toISOString().slice(0, 10);

  const load = useCallback(async () => {
    const weekStart = weekDates[0].toISOString().slice(0, 10);
    const data = await getTasks("week", { week_start: weekStart });
    setTasks(data);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { load(); }, [load]);

  const add = async (dateStr: string) => {
    if (!newTitle.trim()) return;
    const t = await createTask({ title: newTitle.trim(), due_date: dateStr, is_completed: false });
    setTasks(prev => [...prev, t]);
    setNewTitle("");
    setAdding(null);
  };

  const toggle = async (task: Task) => {
    const updated = await updateTask(task.id, { is_completed: !task.is_completed });
    setTasks(prev => prev.map(t => t.id === task.id ? updated : t));
  };

  const remove = async (id: number) => {
    await deleteTask(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="widget">
      <p className="widget-title">WEEKLY TASK</p>

      <div className="grid grid-cols-7 gap-1.5">
        {weekDates.map((date, i) => {
          const dateStr   = date.toISOString().slice(0, 10);
          const dayTasks  = tasks.filter(t => t.due_date === dateStr);
          const isToday   = dateStr === todayStr;
          const isWeekend = i >= 5;

          return (
            <div
              key={dateStr}
              className={`rounded-lg p-2 flex flex-col gap-1 min-h-[100px] border ${
                isToday ? "border-accent bg-accent/5" : "border-card-border"
              }`}
            >
              <div className="text-center">
                <p className={`text-xs font-semibold ${isWeekend ? "text-red-400" : "text-gray-400"}`}>
                  {DAY_LABELS[i]}
                </p>
                <p className={`text-sm font-bold ${isToday ? "text-accent" : "text-white"}`}>
                  {date.getDate()}
                </p>
              </div>

              <div className="flex flex-col gap-0.5 flex-1">
                {dayTasks.map(task => (
                  <div key={task.id} className="group flex items-start gap-1">
                    <button
                      onClick={() => toggle(task)}
                      className={`mt-0.5 w-3 h-3 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                        task.is_completed ? "bg-accent border-accent" : "border-gray-600 hover:border-accent"
                      }`}
                    >
                      {task.is_completed && <div className="w-1.5 h-1.5 rounded-sm bg-white" />}
                    </button>
                    <span
                      onClick={() => remove(task.id)}
                      className={`text-xs leading-tight cursor-pointer ${
                        task.is_completed ? "line-through text-gray-600" : "text-gray-300 group-hover:text-red-400"
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>

              {adding === dateStr ? (
                <input
                  autoFocus value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter") add(dateStr);
                    if (e.key === "Escape") { setAdding(null); setNewTitle(""); }
                  }}
                  onBlur={() => { if (!newTitle.trim()) { setAdding(null); } }}
                  placeholder="タスク"
                  className="text-xs bg-card-border/30 border border-accent/50 rounded px-1 py-0.5 text-white w-full placeholder-gray-700"
                />
              ) : (
                <button
                  onClick={() => { setAdding(dateStr); setNewTitle(""); }}
                  className="text-gray-700 hover:text-accent text-xs transition-colors text-left"
                >
                  +
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
