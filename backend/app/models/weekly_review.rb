class WeeklyReview < ApplicationRecord
  belongs_to :user
  validates :week_start, :content, presence: true
end
