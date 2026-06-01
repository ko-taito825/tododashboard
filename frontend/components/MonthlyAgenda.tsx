"use client";
import { useCallback, useEffect, useState } from "react";
import { createTask, deleteTask, getTasks, updateTask } from "@/lib/api";
import type { Task } from "@/types";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS   = ["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE",
                  "JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"];

function buildCalendar(year: number, month: number) {
  const first    = new Date(year, month - 1, 1);
  const last     = new Date(year, month, 0);
  const startDow = first.getDay(); // 0=Sun
  const days: (number | null)[] = [
    ...Array(startDow).fill(null),
    ...Array.from({ length: last.getDate() }, (_, i) => i + 1),
  ];
  while (days.length % 7 !== 0) days.push(null);
  return days;
}

export default function MonthlyAgenda() {
  const [viewDate, setViewDate] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() + 1 };
  });
  const [tasks, setTasks]       = useState<Task[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());
  const [isAdding, setIsAdding] = useState(false);

  const load = useCallback(async () => {
    const data = await getTasks("month", {
      year: String(viewDate.year), month: String(viewDate.month),
      task_category: "1",
    });
    setTasks(data);
  }, [viewDate]);

  useEffect(() => { load(); }, [load]);

  const days     = buildCalendar(viewDate.year, viewDate.month);
  const todayStr = new Date().toISOString().slice(0, 10);

  const addTask = async (dateStr: string) => {
    if (!newTitle.trim() || isAdding) return;
    setIsAdding(true);
    try {
      const t = await createTask({ title: newTitle.trim(), due_date: dateStr, is_completed: false, task_category: "scheduled" });
      setTasks(prev => [...prev, t]);
      setNewTitle("");
    } finally {
      setIsAdding(false);
    }
  };

  const toggleTask = async (task: Task) => {
    const updated = await updateTask(task.id, { is_completed: !task.is_completed });
    setTasks(prev => prev.map(t => t.id === task.id ? updated : t));
  };

  const removeTask = async (id: number) => {
    if (deletingIds.has(id)) return;
    setDeletingIds(prev => new Set(prev).add(id));
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } finally {
      setDeletingIds(prev => { const s = new Set(prev); s.delete(id); return s; });
    }
  };

  const prevMonth = () => setViewDate(v => ({
    year:  v.month === 1  ? v.year - 1 : v.year,
    month: v.month === 1  ? 12 : v.month - 1,
  }));
  const nextMonth = () => setViewDate(v => ({
    year:  v.month === 12 ? v.year + 1 : v.year,
    month: v.month === 12 ? 1  : v.month + 1,
  }));

  return (
    <div>
      {/* Title */}
      <div className="section-header">
        <span className="section-title">Monthly Agenda</span>
      </div>

      {/* Calendar container */}
      <div className="border border-[#2a2a2a] rounded-lg overflow-hidden">
        {/* Month header */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#0f0a1a]/60">
          <span className="text-2xl font-black text-white tracking-widest">
            {MONTHS[viewDate.month - 1]}
          </span>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <button onClick={prevMonth} className="hover:text-white">·</button>
            <span>{viewDate.year}</span>
            <button onClick={nextMonth} className="hover:text-white">·</button>
          </div>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-[#2a2a2a]">
          {WEEKDAYS.map((d, i) => (
            <div
              key={d}
              className={`text-xs font-semibold text-center py-1.5 border-r border-[#2a2a2a] last:border-r-0 ${
                i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-gray-400"
              }`}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {days.map((day, idx) => {
            if (!day) {
              return (
                <div
                  key={`e-${idx}`}
                  className="border-r border-b border-[#2a2a2a] last:border-r-0 h-16 bg-[#080610]/40"
                />
              );
            }

            const dateStr  = `${viewDate.year}-${String(viewDate.month).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
            const dayTasks = tasks.filter(t => t.due_date === dateStr);
            const isToday  = dateStr === todayStr;
            const isSelected = selected === dateStr;
            const col      = idx % 7;

            return (
              <div
                key={dateStr}
                onClick={() => setSelected(isSelected ? null : dateStr)}
                className={`border-r border-b border-[#2a2a2a] last:border-r-0 h-16 p-1 cursor-pointer transition-colors ${
                  isSelected ? "bg-accent/10" : "hover:bg-[#1a0a2e]/40"
                }`}
              >
                <p className={`text-xs font-semibold leading-none mb-1 ${
                  isToday ? "text-red-400" : col === 0 ? "text-red-300" : col === 6 ? "text-blue-300" : "text-gray-400"
                }`}>
                  {day}
                </p>
                <div className="flex flex-col gap-0.5">
                  {dayTasks.slice(0, 2).map(task => (
                    <div
                      key={task.id}
                      onClick={e => { e.stopPropagation(); toggleTask(task); }}
                      className={`text-[9px] leading-tight truncate px-1 rounded cursor-pointer ${
                        task.is_completed ? "text-gray-600 line-through" : "text-accent-light"
                      }`}
                    >
                      {task.title}
                    </div>
                  ))}
                  {dayTasks.length > 2 && (
                    <p className="text-[9px] text-gray-600">+{dayTasks.length - 2}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected date panel */}
      {selected && (
        <div className="mt-3 border border-[#2a2a2a] rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-white">{selected}</p>
            <button onClick={() => setSelected(null)} className="text-gray-600 hover:text-gray-400 text-xs">✕</button>
          </div>
          <div className="flex flex-col gap-1 mb-2 max-h-24 overflow-y-auto">
            {tasks.filter(t => t.due_date === selected).map(task => (
              <div key={task.id} className="flex items-center gap-2 group">
                <button
                  onClick={() => toggleTask(task)}
                  className={`w-3 h-3 rounded border flex-shrink-0 ${
                    task.is_completed ? "bg-accent border-accent" : "border-gray-600 hover:border-accent"
                  }`}
                />
                <span className={`text-xs flex-1 ${task.is_completed ? "line-through text-gray-600" : "text-gray-200"}`}>
                  {task.title}
                </span>
                <button
                  onClick={() => removeTask(task.id)}
                  disabled={deletingIds.has(task.id)}
                  className="opacity-0 group-hover:opacity-100 text-red-400 text-xs disabled:opacity-30 disabled:cursor-not-allowed"
                >✕</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              onKeyDown={e => { if (e.isComposing || e.nativeEvent.isComposing) return; if (e.key === "Enter") addTask(selected); }}
              placeholder="予定を追加..."
              className="flex-1 text-xs border-b border-accent/40 text-white placeholder-gray-700 py-0.5"
            />
            <button
              onClick={() => addTask(selected)}
              disabled={isAdding}
              className="text-xs text-accent hover:text-accent-light disabled:opacity-40 disabled:cursor-not-allowed"
            >{isAdding ? "…" : "追加"}</button>
          </div>
        </div>
      )}
    </div>
  );
}
