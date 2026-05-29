module Api
  module V1
    class DailyMemosController < BaseController
      def show
        date = params[:date] ? Date.parse(params[:date]) : Date.today
        memo = current_user.daily_memos.find_by(target_date: date)
        if memo
          render json: memo
        else
          render json: { content: "", target_date: date }, status: :ok
        end
      end

      def upsert
        date = params[:date] ? Date.parse(params[:date]) : Date.today
        memo = current_user.daily_memos.find_or_initialize_by(target_date: date)
        memo.content = params.dig(:daily_memo, :content) || ""

        if memo.save
          render json: memo, status: memo.previously_new_record? ? :created : :ok
        else
          render json: { errors: memo.errors.full_messages }, status: :unprocessable_entity
        end
      end
    end
  end
end
