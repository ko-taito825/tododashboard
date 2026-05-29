module Api
  module V1
    class HabitsController < BaseController
      before_action :set_habit, only: [:update, :destroy]

      def index
        habits = current_user.habits.order(:created_at)
        habits = habits.where(category: params[:category]) if params[:category].present?
        render json: habits
      end

      def create
        habit = current_user.habits.build(habit_params)
        if habit.save
          render json: habit, status: :created
        else
          render json: { errors: habit.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @habit.update(habit_params)
          render json: @habit
        else
          render json: { errors: @habit.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @habit.destroy
        head :no_content
      end

      private

      def set_habit
        @habit = current_user.habits.find(params[:id])
      end

      def habit_params
        params.require(:habit).permit(:name, :category)
      end
    end
  end
end
