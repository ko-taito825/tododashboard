module Api
  module V1
    class ProgressController < BaseController
      def weekly
        week_start = params[:week_start] ? Date.parse(params[:week_start]) : Date.today.beginning_of_week(:monday)
        week_dates = (0..6).map { |i| week_start + i.days }

        habit_ids = current_user.habits.pluck(:id)
        total_habits = habit_ids.size

        data = week_dates.map do |date|
          tasks      = current_user.tasks.for_date(date)
          total_tasks = tasks.count
          done_tasks  = tasks.where(is_completed: true).count

          done_habits = total_habits > 0 ?
            HabitLog.where(habit_id: habit_ids, logged_on: date, is_completed: true).count : 0

          total = total_tasks + total_habits
          done  = done_tasks + done_habits
          rate  = total > 0 ? (done.to_f / total * 100).round : 0

          {
            date:        date.strftime("%m/%d"),
            day:         date.strftime("%a"),
            total_tasks: total_tasks,
            done_tasks:  done_tasks,
            total_habits: total_habits,
            done_habits:  done_habits,
            completion_rate: rate
          }
        end

        render json: data
      end
    end
  end
end
