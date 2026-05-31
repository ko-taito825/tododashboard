module Api
  module V1
    class BaseController < ApplicationController
      before_action :authenticate!

      private

      def current_user
        @current_user ||= begin
          email = request.headers["X-User-Email"].presence
          if email
            User.find_or_create_by!(email: email) do |u|
              u.password              = SecureRandom.hex(20)
              u.password_confirmation = u.password
            end
          else
            # fallback: first user (dev without auth)
            User.first!
          end
        end
      end

      def authenticate!
        current_user
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Unauthorized" }, status: :unauthorized
      end
    end
  end
end
