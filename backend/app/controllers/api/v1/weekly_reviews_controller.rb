module Api
  module V1
    class WeeklyReviewsController < BaseController
      def index
        reviews = current_user.weekly_reviews.order(week_start: :desc).limit(12)
        render json: reviews
      end

      def create
        week_start = Date.parse(params.require(:week_start))
        review = current_user.weekly_reviews.find_or_initialize_by(week_start: week_start)
        review.content = params.require(:content)
        if review.save
          render json: review, status: :created
        else
          render json: { errors: review.errors.full_messages }, status: :unprocessable_entity
        end
      end
    end
  end
end
