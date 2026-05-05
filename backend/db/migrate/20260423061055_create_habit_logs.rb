class CreateHabitLogs < ActiveRecord::Migration[8.1]
  def change
    create_table :habit_logs do |t|
      t.date :logged_on
      t.boolean :is_completed
      t.text :memo
      t.references :habit, null: false, foreign_key: true

      t.timestamps
    end
  end
end
