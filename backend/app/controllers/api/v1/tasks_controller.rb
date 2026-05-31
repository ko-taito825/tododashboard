module Api
  module V1
    class TasksController < BaseController
      before_action :set_task, only: [:update, :destroy]

      def index
        tasks = current_user.tasks.order(due_date: :asc, created_at: :asc)

        tasks = tasks.where(task_category: params[:task_category]) if params[:task_category].present?

        tasks = case params[:filter]
        when "today"
          date = params[:date].present? ? Date.parse(params[:date]) : Date.today
          tasks.for_date(date)
        when "week"
          week_start = params[:week_start] ? Date.parse(params[:week_start]) : Date.today.beginning_of_week(:monday)
          tasks.for_week(week_start)
        when "month"
          year  = (params[:year]  || Date.today.year).to_i
          month = (params[:month] || Date.today.month).to_i
          tasks.for_month(year, month)
        else
          tasks
        end

        render json: tasks
      end

      def create
        task = current_user.tasks.build(task_params)
        if task.save
          render json: task, status: :created
        else
          render json: { errors: task.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @task.update(task_params)
          render json: @task
        else
          render json: { errors: @task.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @task.destroy
        head :no_content
      end

      private

      def set_task
        @task = current_user.tasks.find(params[:id])
      end

      def task_params
        params.require(:task).permit(:title, :description, :due_date, :is_completed, :task_category)
      end
    end
  end
end
