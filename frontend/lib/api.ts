const BASE = "/api/v1";

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { errors?: string[] }).errors?.join(", ") ?? res.statusText);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// --- Tasks ---
export const getTasks = (filter?: string, extra?: Record<string, string>) =>
  request<import("@/types").Task[]>(`/tasks?${new URLSearchParams({ ...(filter ? { filter } : {}), ...extra })}`);

export const createTask = (data: Partial<import("@/types").Task>) =>
  request<import("@/types").Task>("/tasks", { method: "POST", body: JSON.stringify({ task: data }) });

export const updateTask = (id: number, data: Partial<import("@/types").Task>) =>
  request<import("@/types").Task>(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify({ task: data }) });

export const deleteTask = (id: number) =>
  request<void>(`/tasks/${id}`, { method: "DELETE" });

// --- Habits ---
export const getHabits = (category?: string) =>
  request<import("@/types").Habit[]>(`/habits${category ? `?category=${category}` : ""}`);

export const createHabit = (data: Partial<import("@/types").Habit>) =>
  request<import("@/types").Habit>("/habits", { method: "POST", body: JSON.stringify({ habit: data }) });

export const updateHabit = (id: number, data: Partial<import("@/types").Habit>) =>
  request<import("@/types").Habit>(`/habits/${id}`, { method: "PATCH", body: JSON.stringify({ habit: data }) });

export const deleteHabit = (id: number) =>
  request<void>(`/habits/${id}`, { method: "DELETE" });

// --- Habit Logs ---
export const getHabitLogs = (date: string) =>
  request<import("@/types").HabitLog[]>(`/habit_logs?date=${date}`);

export const upsertHabitLog = (habitId: number, loggedOn: string, isCompleted: boolean) =>
  request<import("@/types").HabitLog>(`/habits/${habitId}/habit_logs/upsert`, {
    method: "POST",
    body: JSON.stringify({ habit_log: { is_completed: isCompleted }, logged_on: loggedOn }),
  });

// --- Daily Memos ---
export const getDailyMemo = (date: string) =>
  request<import("@/types").DailyMemo>(`/daily_memos?date=${date}`);

export const upsertDailyMemo = (date: string, content: string) =>
  request<import("@/types").DailyMemo>("/daily_memos/upsert", {
    method: "POST",
    body: JSON.stringify({ daily_memo: { content }, date }),
  });

// --- Progress ---
export const getWeeklyProgress = (weekStart?: string) =>
  request<import("@/types").ProgressData[]>(
    `/progress/weekly${weekStart ? `?week_start=${weekStart}` : ""}`
  );

// --- Weekly Reviews ---
export const getWeeklyReviews = () =>
  fetch("/api/weekly-review").then(r => r.json()) as Promise<import("@/types").WeeklyReview[]>;

export const generateWeeklyReview = (weekStart: string) =>
  fetch("/api/weekly-review", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ week_start: weekStart }),
  }).then(r => r.json()) as Promise<import("@/types").WeeklyReview>;
