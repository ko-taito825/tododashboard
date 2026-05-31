class Task < ApplicationRecord
  belongs_to :user

  enum :task_category, { daily: 0, scheduled: 1 }

  validates :title, presence: true

  scope :for_date, ->(date) { where(due_date: date) }
  scope :for_week, ->(start_date) { where(due_date: start_date..(start_date + 6.days)) }
  scope :for_month, ->(year, month) {
    start_date = Date.new(year, month, 1)
    where(due_date: start_date..start_date.end_of_month)
  }
end
