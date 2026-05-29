"use client";
import { useCallback, useEffect, useState } from "react";
import { createTask, deleteTask, getTasks, updateTask } from "@/lib/api";
import type { Task } from "@/types";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function buildCalendar(year: number, month: number) {
  const first = new Date(year, month - 1, 1);
  const last  = new Date(year, month, 0);
  const startDow = (first.getDay() + 6) % 7; // 0=Mon
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
  const [tasks, setTasks]     = useState<Task[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");

  const load = useCallback(async () => {
    const data = await getTasks("month", {
      year:  String(viewDate.year),
      month: String(viewDate.month),
    });
    setTasks(data);
  }, [viewDate]);

  useEffect(() => { load(); }, [load]);

  const days = buildCalendar(viewDate.year, viewDate.month);
  const todayStr = new Date().toISOString().slice(0, 10);

  const addTask = async (dateStr: string) => {
    if (!newTitle.trim()) return;
    const t = await createTask({ title: newTitle.trim(), due_date: dateStr, is_completed: false });
    setTasks(prev => [...prev, t]);
    setNewTitle("");
  };

  const toggleTask = async (task: Task) => {
    const updated = await updateTask(task.id, { is_completed: !task.is_completed });
    setTasks(prev => prev.map(t => t.id === task.id ? updated : t));
  };

  const removeTask = async (id: number) => {
    await deleteTask(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const prevMonth = () => setViewDate(v => {
    const m = v.month - 1 < 1 ? 12 : v.month - 1;
    const y = v.month - 1 < 1 ? v.year - 1 : v.year;
    return { year: y, month: m };
  });

  const nextMonth = () => setViewDate(v => {
    const m = v.month + 1 > 12 ? 1 : v.month + 1;
    const y = v.month + 1 > 12 ? v.year + 1 : v.year;
    return { year: y, month: m };
  });

  return (
    <div className="widget">
      <div className="flex items-center justify-between">
        <p className="widget-title">MONTHLY AGENDA</p>
        <div className="flex items-center gap-3">
          <button onClick={prevMonth} className="text-gray-400 hover:text-white px-1">‹</button>
          <span className="text-sm font-semibold text-white">
            {viewDate.year}年 {viewDate.month}月
          </span>
          <button onClick={nextMonth} className="text-gray-400 hover:text-white px-1">›</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map((d, i) => (
          <div key={d} className={`text-center text-xs font-semibold py-1 ${i >= 5 ? "text-red-400" : "text-gray-500"}`}>
            {d}
          </div>
        ))}

        {days.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} />;

          const dateStr = `${viewDate.year}-${String(viewDate.month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const dayTasks = tasks.filter(t => t.due_date === dateStr);
          const isToday   = dateStr === todayStr;
          const isSelected = selected === dateStr;
          const col = idx % 7;

          return (
            <div
              key={dateStr}
              onClick={() => setSelected(isSelected ? null : dateStr)}
              className={`rounded-lg p-1.5 cursor-pointer min-h-[56px] transition-colors border ${
                isToday     ? "border-accent bg-accent/10"
                : isSelected ? "border-accent-light bg-accent/5"
                             : "border-card-border hover:border-gray-600"
              }`}
            >
              <p className={`text-xs font-semibold mb-0.5 ${
                isToday ? "text-accent" : col >= 5 ? "text-red-400" : "text-gray-300"
              }`}>
                {day}
              </p>
              <div className="flex flex-col gap-0.5">
                {dayTasks.slice(0, 2).map(task => (
                  <div
                    key={task.id}
                    onClick={e => { e.stopPropagation(); toggleTask(task); }}
                    className={`text-[10px] leading-tight px-1 py-0.5 rounded truncate cursor-pointer ${
                      task.is_completed
                        ? "bg-gray-700 text-gray-500 line-through"
                        : "bg-accent/20 text-accent-light"
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

      {selected && (
        <div className="border-t border-card-border pt-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-white">{selected}</p>
            <button onClick={() => setSelected(null)} className="text-gray-600 hover:text-gray-400 text-xs">✕</button>
          </div>
          <div className="flex flex-col gap-1 mb-2 max-h-32 overflow-y-auto">
            {tasks.filter(t => t.due_date === selected).map(task => (
              <div key={task.id} className="flex items-center gap-2 group">
                <button
                  onClick={() => toggleTask(task)}
                  className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 ${
                    task.is_completed ? "bg-accent border-accent" : "border-gray-600 hover:border-accent"
                  }`}
                >
                  {task.is_completed && <div className="w-2 h-2 bg-white rounded-sm" />}
                </button>
                <span className={`text-sm flex-1 ${task.is_completed ? "line-through text-gray-500" : "text-gray-200"}`}>
                  {task.title}
                </span>
                <button
                  onClick={() => removeTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 text-red-400 text-xs"
                >✕</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") addTask(selected); }}
              placeholder="予定を追加..."
              className="flex-1 text-sm bg-card-border/30 border border-card-border rounded px-2 py-1 text-white placeholder-gray-600"
            />
            <button onClick={() => addTask(selected)} className="btn-accent">追加</button>
          </div>
        </div>
      )}
    </div>
  );
}
