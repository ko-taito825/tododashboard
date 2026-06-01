import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

const RAILS = "http://localhost:3001/api/v1";

async function railsGet<T>(path: string, email: string): Promise<T> {
  const res = await fetch(`${RAILS}${path}`, {
    headers: { "X-User-Email": email, "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`Rails ${res.status}: ${path}`);
  return res.json();
}

async function railsPost<T>(path: string, email: string, body: object): Promise<T> {
  const res = await fetch(`${RAILS}${path}`, {
    method: "POST",
    headers: { "X-User-Email": email, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Rails ${res.status}: ${path}`);
  return res.json();
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const reviews = await railsGet("/weekly_reviews", session.user.email);
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { week_start } = await req.json();
  const email = session.user.email;

  // Fetch last week's progress
  type ProgressItem = { done_tasks: number; done_habits: number; completion_rate: number };
  const progress = await railsGet<ProgressItem[]>(`/progress/weekly?week_start=${week_start}`, email);

  // Fetch memos for each day of last week
  type MemoItem = { content: string; target_date: string };
  const memoResults = await Promise.all(
    Array.from({ length: 7 }, (_, i) => {
      const d = new Date(week_start);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().slice(0, 10);
      return railsGet<MemoItem>(`/daily_memos?date=${dateStr}`, email).catch(() => null);
    })
  );
  const memos = memoResults
    .filter((m): m is MemoItem => !!m?.content)
    .map(m => `${m.target_date}: ${m.content}`);

  const totalTasks  = progress.reduce((s, d) => s + d.done_tasks, 0);
  const totalHabits = progress.reduce((s, d) => s + d.done_habits, 0);
  const avgRate     = Math.round(progress.reduce((s, d) => s + d.completion_rate, 0) / progress.length);

  const prompt = `先週（${week_start} 〜）の活動データ：
- タスク完了数：${totalTasks}件
- 習慣達成数：${totalHabits}回
- 平均完了率：${avgRate}%
${memos.length > 0 ? `- メモ：${memos.join("、")}` : ""}

上記を踏まえて、ユーザーへの励ましと来週への具体的なアドバイスを含む200〜300文字の日本語レビューを書いてください。`;

  const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 600,
    }),
  });

  if (!openaiRes.ok) {
    const err = await openaiRes.text();
    return NextResponse.json({ error: `OpenAI error: ${err}` }, { status: 502 });
  }

  const openaiData = await openaiRes.json() as { choices: { message: { content: string } }[] };
  const content = openaiData.choices[0]?.message?.content ?? "レビューを生成できませんでした。";

  const saved = await railsPost("/weekly_reviews", email, { week_start, content });
  return NextResponse.json(saved, { status: 201 });
}
