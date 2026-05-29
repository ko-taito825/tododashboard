export interface Task {
  id: number;
  title: string;
  description: string | null;
  due_date: string | null;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Habit {
  id: number;
  name: string;
  category: "morning_routine" | "night_routine" | "general";
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface HabitLog {
  id: number;
  habit_id: number;
  logged_on: string;
  is_completed: boolean;
  memo: string | null;
  created_at: string;
  updated_at: string;
}

export interface DailyMemo {
  id?: number;
  content: string;
  target_date: string;
}

export interface ProgressData {
  date: string;
  day: string;
  total_tasks: number;
  done_tasks: number;
  total_habits: number;
  done_habits: number;
  completion_rate: number;
}
