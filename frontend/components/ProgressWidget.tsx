"use client";
import { useCallback, useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getWeeklyProgress } from "@/lib/api";
import type { ProgressData } from "@/types";

function mondayOf(d: Date) {
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const m = new Date(d);
  m.setDate(diff);
  m.setHours(0, 0, 0, 0);
  return m;
}

export default function ProgressWidget() {
  const [data, setData]           = useState<ProgressData[]>([]);
  const [weekOffset, setWeekOffset] = useState(0);

  const getWeekStart = useCallback(() => {
    const base = mondayOf(new Date());
    base.setDate(base.getDate() + weekOffset * 7);
    return base.toISOString().slice(0, 10);
  }, [weekOffset]);

  const load = useCallback(async () => {
    const d = await getWeeklyProgress(getWeekStart());
    setData(d);
  }, [getWeekStart]);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      {/* Title */}
      <div className="flex items-center gap-1.5 mb-3">
        <span className="text-sm">👤</span>
        <span className="text-accent text-sm font-bold">Progress</span>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#6b7280", fontSize: 10 }}
            axisLine={{ stroke: "#333" }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 50, 100]}
            tick={{ fill: "#6b7280", fontSize: 10 }}
            axisLine={{ stroke: "#333" }}
            tickLine={false}
            tickFormatter={v => `${v}`}
            label={{ value: "(%)", angle: -90, position: "insideLeft", offset: 12, fill: "#6b7280", fontSize: 10 }}
          />
          <Tooltip
            contentStyle={{ background: "#111", border: "1px solid #333", borderRadius: "6px", fontSize: 11 }}
            formatter={(v: number) => [`${v}%`, "完了率"]}
          />
          <Line
            type="monotone"
            dataKey="completion_rate"
            stroke="#7B2FBE"
            strokeWidth={2}
            dot={{ fill: "#7B2FBE", r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Week navigation */}
      <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
        <button onClick={() => setWeekOffset(w => w - 1)} className="hover:text-accent px-1">{"<"}</button>
        <div className="flex gap-2">
          {data.map(d => (
            <span key={d.date}>{d.date}</span>
          ))}
        </div>
        <button onClick={() => setWeekOffset(w => w + 1)} className="hover:text-accent px-1">{">"}</button>
      </div>
      <p className="text-[10px] text-gray-600 text-center mt-1">(day)</p>
      <p className="text-[10px] text-gray-600 text-center mt-2">
        Progress = (Completed Tasks + Completed Habits) / Total
      </p>
    </div>
  );
}
