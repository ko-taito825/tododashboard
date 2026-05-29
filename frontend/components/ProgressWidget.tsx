"use client";
import { useCallback, useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getWeeklyProgress } from "@/lib/api";
import type { ProgressData } from "@/types";

export default function ProgressWidget() {
  const [data, setData] = useState<ProgressData[]>([]);

  const load = useCallback(async () => {
    const d = await getWeeklyProgress();
    setData(d);
  }, []);

  useEffect(() => { load(); }, [load]);

  const todayStr = new Date().toLocaleDateString("ja-JP", { month: "2-digit", day: "2-digit" }).replace(/\//g, "/");

  const weeklyAvg = data.length > 0
    ? Math.round(data.reduce((s, d) => s + d.completion_rate, 0) / data.length)
    : 0;

  return (
    <div className="widget">
      <div className="flex items-center justify-between">
        <p className="widget-title">PROGRESS</p>
        <span className="text-xs text-accent font-semibold">週平均 {weeklyAvg}%</span>
      </div>

      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -30, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fill: "#6b7280", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "#6b7280", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px" }}
            labelStyle={{ color: "#9ca3af", fontSize: 11 }}
            formatter={(value: number) => [`${value}%`, "完了率"]}
          />
          <Bar dataKey="completion_rate" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.date}
                fill={entry.date === todayStr ? "#7B2FBE" : "#3d1a6e"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-7 gap-1 text-center">
        {data.map(d => (
          <div key={d.date}>
            <p className="text-xs font-bold text-white">{d.completion_rate}%</p>
            <p className="text-[10px] text-gray-600">{d.done_tasks + d.done_habits}/{d.total_tasks + d.total_habits}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
