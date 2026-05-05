class FixDailyMemosConstraint < ActiveRecord::Migration[8.1]
  def change
    # change_column ではなく change_column_null を使う
    change_column_null :daily_memos, :target_date, false
    change_column_null :habit_logs, :logged_on, false

    # 必須チェックの追加
    change_column_null :daily_memos, :content, false
    change_column_null :habits, :name, false
    change_column_null :tasks, :title, false

    # デフォルト値の追加（fromとtoを両方書くことで、戻す時にも迷わなくなる）
    change_column_default :habit_logs, :is_completed, from: nil, to: false
    change_column_null :habit_logs, :is_completed, false

    # 二重登録の防止（ユニークインデックス）
    add_index :daily_memos, [:user_id, :target_date], unique: true
    add_index :habit_logs, [:habit_id, :logged_on], unique: true
  end
end