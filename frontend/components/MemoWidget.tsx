"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { getDailyMemo, upsertDailyMemo } from "@/lib/api";

export default function MemoWidget() {
  const [content, setContent] = useState("");
  const [saved, setSaved]     = useState(true);
  const today = new Date().toISOString().slice(0, 10);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async () => {
    const memo = await getDailyMemo(today);
    setContent(memo.content ?? "");
  }, [today]);

  useEffect(() => { load(); }, [load]);

  const handleChange = (value: string) => {
    setContent(value);
    setSaved(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      await upsertDailyMemo(today, value);
      setSaved(true);
    }, 800);
  };

  return (
    <div className="widget h-full">
      <div className="flex items-center justify-between">
        <p className="widget-title">MEMO</p>
        <span className={`text-xs transition-colors ${saved ? "text-gray-600" : "text-accent"}`}>
          {saved ? "保存済み" : "保存中..."}
        </span>
      </div>
      <textarea
        value={content}
        onChange={e => handleChange(e.target.value)}
        placeholder="今日のメモを書こう..."
        className="flex-1 w-full bg-transparent text-sm text-gray-300 placeholder-gray-600 resize-none leading-relaxed focus:outline-none"
        rows={8}
      />
    </div>
  );
}
