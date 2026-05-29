module Api
  module V1
    class BaseController < ApplicationController
      private

      def current_user
        User.first!
      end
    end
  end
end
