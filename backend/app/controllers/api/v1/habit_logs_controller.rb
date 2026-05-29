module Api
  module V1
    class HabitLogsController < BaseController
      def index
        date = params[:date] ? Date.parse(params[:date]) : Date.today
        habit_ids = current_user.habits.pluck(:id)
        logs = HabitLog.where(habit_id: habit_ids, logged_on: date)
        render json: logs
      end

      def upsert
        habit = current_user.habits.find(params[:habit_id])
        date  = params[:logged_on] ? Date.parse(params[:logged_on]) : Date.today

        log = HabitLog.find_or_initialize_by(habit: habit, logged_on: date)
        log.is_completed = params.dig(:habit_log, :is_completed)

        if log.save
          render json: log, status: log.previously_new_record? ? :created : :ok
        else
          render json: { errors: log.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        habit = current_user.habits.find(params[:habit_id])
        log = HabitLog.find_by!(habit: habit, id: params[:id])
        log.destroy
        head :no_content
      end
    end
  end
end
