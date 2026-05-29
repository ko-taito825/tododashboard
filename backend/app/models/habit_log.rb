class HabitLog < ApplicationRecord
  belongs_to :habit

  validates :logged_on, uniqueness: { scope: :habit_id }
end
