import CurrentTime from "@/components/CurrentTime";
import MemoWidget from "@/components/MemoWidget";
import MonthlyAgenda from "@/components/MonthlyAgenda";
import ProgressWidget from "@/components/ProgressWidget";
import RoutineWidget from "@/components/RoutineWidget";
import TimerWidget from "@/components/TimerWidget";
import TodaysHabit from "@/components/TodaysHabit";
import TodaysTasks from "@/components/TodaysTasks";
import WeatherWidget from "@/components/WeatherWidget";
import WeeklyTask from "@/components/WeeklyTask";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-bg p-6">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between border-b border-card-border pb-4">
        <h1 className="text-3xl font-bold tracking-[0.3em] text-white uppercase">
          Dashboard
        </h1>
        <p className="text-xs text-gray-600 tracking-widest uppercase">
          Personal Productivity
        </p>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-4">

        {/* ── Left column (col 1-3): Routines + Habit ── */}
        <div className="col-span-3 flex flex-col gap-4">
          <RoutineWidget category="morning_routine" title="Morning Routine" />
          <RoutineWidget category="night_routine"   title="Night Routine"   />
          <TodaysHabit />
        </div>

        {/* ── Middle column (col 4-8): Tasks + Memo ── */}
        <div className="col-span-5 flex flex-col gap-4">
          <div className="flex-1">
            <TodaysTasks />
          </div>
          <MemoWidget />
        </div>

        {/* ── Right column (col 9-12): Clock + Timer + Weather + Progress ── */}
        <div className="col-span-4 flex flex-col gap-4">
          <CurrentTime />
          <TimerWidget />
          <WeatherWidget />
          <ProgressWidget />
        </div>

        {/* ── Bottom: Weekly Task (full width) ── */}
        <div className="col-span-12">
          <WeeklyTask />
        </div>

        {/* ── Bottom: Monthly Agenda (full width) ── */}
        <div className="col-span-12">
          <MonthlyAgenda />
        </div>
      </div>
    </main>
  );
}
