class AddConstraints < ActiveRecord::Migration[8.1]
  def change
    change_column_null :daily_memos, :target_date, false
    change_column_null :habit_logs, :logged_on, false

    change_column_null :tasks, :title, false
    change_column_null :habits, :name, false

    change_column_default :habit_logs, :is_completed, false
    change_column_null :habit_logs, :is_completed, false

    add_index :daily_memos, [:user_id, :target_date], unique: true
    add_index :habit_logs, [:habit_id, :logged_on], unique: true
  end
end