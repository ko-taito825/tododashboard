Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :tasks
      resources :habits do
        resources :habit_logs, only: [:destroy] do
          collection do
            post :upsert
          end
        end
      end
      resources :habit_logs, only: [:index]
      resources :daily_memos, only: [] do
        collection do
          get  :show
          post :upsert
        end
      end
      namespace :progress do
        get :weekly
      end
      resources :weekly_reviews, only: [:index, :create]
    end
  end

  get "up" => "rails/health#show", as: :rails_health_check
end
