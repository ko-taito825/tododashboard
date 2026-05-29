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
    <div className="flex min-h-screen bg-[#0C0C0C] text-white">

      {/* ── Main content (left) ── */}
      <div className="flex-1 min-w-0 flex flex-col">

        {/* Hero */}
        <div
          className="h-48 w-full bg-[#0d0820] shrink-0"
          style={{
            backgroundImage: "url('/hero.png')",
            backgroundSize: "100% auto",
            backgroundPosition: "top center",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* DASHBOARD title */}
        <div className="px-8 pt-5 pb-2">
          <h1 className="text-3xl font-black tracking-[0.35em] text-white">DASHBOARD</h1>
          <hr className="mt-2 border-gray-700" />
        </div>

        {/* Content grid: Routines | Habit | Tasks */}
        <div className="px-8 mt-5 grid grid-cols-[220px_1fr_1fr] gap-8">
          <div className="flex flex-col gap-6">
            <RoutineWidget category="morning_routine" title="MORNING ROUTINE" icon="sun" />
            <RoutineWidget category="night_routine"   title="NIGHT ROUTINE"   icon="moon" />
          </div>
          <TodaysHabit />
          <TodaysTasks />
        </div>

        {/* Cards row: Memo | Weather | Weekly Task */}
        <div className="px-8 mt-6 grid grid-cols-3 gap-4">
          <MemoWidget />
          <WeatherWidget />
          <WeeklyTask />
        </div>

        {/* Bottom: Progress | Monthly Agenda */}
        <div className="px-8 mt-8 mb-10 grid grid-cols-[2fr_3fr] gap-10 items-start">
          <ProgressWidget />
          <MonthlyAgenda />
        </div>
      </div>

      {/* ── Right sidebar: Clock + Timer ── */}
      <div className="w-[220px] shrink-0 flex flex-col gap-4 px-3 pt-0">
        <CurrentTime />
        <TimerWidget />
      </div>

    </div>
  );
}
