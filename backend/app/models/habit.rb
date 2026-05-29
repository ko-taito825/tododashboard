class Habit < ApplicationRecord
  belongs_to :user
  has_many :habit_logs, dependent: :destroy

  enum :category, { morning_routine: 0, night_routine: 1, general: 2 }

  validates :name, presence: true
end
