class AddTaskCategoryToTasks < ActiveRecord::Migration[8.1]
  def change
    add_column :tasks, :task_category, :integer, default: 0, null: false
  end
end
