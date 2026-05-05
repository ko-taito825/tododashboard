class CreateDailyMemos < ActiveRecord::Migration[8.1]
  def change
    create_table :daily_memos do |t|
      t.date :target_date
      t.text :content
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
