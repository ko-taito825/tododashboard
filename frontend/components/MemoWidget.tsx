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
    <div className="data-card flex flex-col h-40">
      <p className="text-accent text-xs font-bold text-center tracking-widest mb-2">MEMO</p>
      <textarea
        value={content}
        onChange={e => handleChange(e.target.value)}
        placeholder="メモを入力..."
        className="flex-1 w-full bg-transparent text-xs text-gray-300 placeholder-gray-700 resize-none leading-relaxed focus:outline-none"
      />
      <p className={`text-[10px] text-right mt-1 transition-colors ${saved ? "text-gray-700" : "text-accent"}`}>
        {saved ? "保存済み" : "保存中..."}
      </p>
    </div>
  );
}
