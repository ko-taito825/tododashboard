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
    <div className="min-h-screen bg-[#0C0C0C] text-white">

      {/* ── Hero (full width, no clock overlay) ── */}
      <div
        className="h-[280px] w-full"
        style={{
          backgroundImage: "url('/hero.png')",
          backgroundSize: "100% auto",
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#0d0820",
        }}
      />

      {/* ── DASHBOARD title + hr (full width, px-12 indent) ── */}
      <div className="px-12 pt-5 pb-0">
        <h1 className="text-3xl font-black tracking-[0.35em] text-white">DASHBOARD</h1>
      </div>
      {/* hr: spans only the content area, stops at sidebar left edge (300px from right) */}
      <hr className="mt-2 border-gray-700 ml-12" style={{ marginRight: "300px" }} />

      {/* ── Content + Right sidebar ── */}
      <div className="flex">

        {/* Left content */}
        <div className="flex-1 min-w-0">
          {/* Content grid: Routines | Habit | Tasks */}
          <div className="px-12 mt-5 grid grid-cols-[220px_1fr_1fr] gap-8">
            <div className="flex flex-col gap-6">
              <RoutineWidget category="morning_routine" title="MORNING ROUTINE" icon="sun" />
              <RoutineWidget category="night_routine"   title="NIGHT ROUTINE"   icon="moon" />
            </div>
            <TodaysHabit />
            <TodaysTasks />
          </div>

          {/* Cards row: Memo | Weather | Weekly Task */}
          <div className="px-12 mt-6 grid grid-cols-3 gap-4">
            <MemoWidget />
            <WeatherWidget />
            <WeeklyTask />
          </div>
        </div>

        {/* Right sidebar: Clock at same level as content grid (mt-5 matches grid) */}
        <div className="w-[300px] shrink-0 flex flex-col px-4">
          <CurrentTime />
          <div className="mt-4">
            <TimerWidget />
          </div>
        </div>
      </div>

      {/* ── Full-width bottom: Progress + Monthly Agenda ── */}
      <div className="px-12 mt-8 mb-10 grid grid-cols-[2fr_3fr] gap-10 items-start">
        <ProgressWidget />
        <MonthlyAgenda />
      </div>

    </div>
  );
}
