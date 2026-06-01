class CreateWeeklyReviews < ActiveRecord::Migration[8.1]
  def change
    create_table :weekly_reviews do |t|
      t.bigint :user_id, null: false
      t.date   :week_start, null: false
      t.text   :content, null: false
      t.timestamps
    end
    add_index :weekly_reviews, [:user_id, :week_start], unique: true
    add_foreign_key :weekly_reviews, :users
  end
end
