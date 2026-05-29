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

      {/* ── Hero (full width) with clock overlaid ── */}
      <div className="relative">
        <div
          className="h-[220px] w-full"
          style={{
            backgroundImage: "url('/hero.png')",
            backgroundSize: "100% auto",
            backgroundPosition: "top center",
            backgroundRepeat: "no-repeat",
            backgroundColor: "#0d0820",
          }}
        />
        {/* Clock: straddling the hero bottom edge */}
        <div className="absolute right-4" style={{ bottom: "-55px" }}>
          <CurrentTime />
        </div>
      </div>

      {/* ── DASHBOARD title (full width so hr reaches under the clock) ── */}
      <div className="px-8 pt-5 pb-0">
        <h1 className="text-3xl font-black tracking-[0.35em] text-white">DASHBOARD</h1>
      </div>
      <hr className="mt-2 border-gray-700" />

      {/* ── Content area + Timer sidebar ── */}
      <div className="flex">

        {/* Left: Dashboard content */}
        <div className="flex-1 min-w-0">
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
        </div>

        {/* Right: Timer sidebar — pt pushes timer below the clock + header area */}
        <div className="w-[230px] shrink-0 px-3 pt-24">
          <TimerWidget />
        </div>
      </div>

      {/* ── Full-width bottom: Progress + Monthly Agenda ── */}
      <div className="px-8 mt-8 mb-10 grid grid-cols-[2fr_3fr] gap-10 items-start">
        <ProgressWidget />
        <MonthlyAgenda />
      </div>

    </div>
  );
}
