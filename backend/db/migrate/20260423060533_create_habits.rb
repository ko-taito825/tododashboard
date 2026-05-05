class CreateHabits < ActiveRecord::Migration[8.1]
  def change
    create_table :habits do |t|
      t.string :name
      t.integer :category, default: 0, null: false
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
