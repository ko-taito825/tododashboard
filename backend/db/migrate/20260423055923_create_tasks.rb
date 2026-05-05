class CreateTasks < ActiveRecord::Migration[8.1]
  def change
    create_table :tasks do |t|
      t.string :title
      t.text :description
      t.date :due_date
      t.boolean :is_completed, default: false, null: false
      t.references :user, null: false, foreign_key: true
      t.timestamps
    end
  end
end
