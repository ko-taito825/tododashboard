# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_06_01_000001) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "daily_memos", force: :cascade do |t|
    t.text "content", null: false
    t.datetime "created_at", null: false
    t.date "target_date", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["user_id", "target_date"], name: "index_daily_memos_on_user_id_and_target_date", unique: true
    t.index ["user_id"], name: "index_daily_memos_on_user_id"
  end

  create_table "habit_logs", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "habit_id", null: false
    t.boolean "is_completed", default: false, null: false
    t.date "logged_on", null: false
    t.text "memo"
    t.datetime "updated_at", null: false
    t.index ["habit_id", "logged_on"], name: "index_habit_logs_on_habit_id_and_logged_on", unique: true
    t.index ["habit_id"], name: "index_habit_logs_on_habit_id"
  end

  create_table "habits", force: :cascade do |t|
    t.integer "category", default: 0, null: false
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["user_id"], name: "index_habits_on_user_id"
  end

  create_table "tasks", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "description"
    t.date "due_date"
    t.boolean "is_completed", default: false, null: false
    t.integer "task_category", default: 0, null: false
    t.string "title", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["user_id"], name: "index_tasks_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.datetime "remember_created_at"
    t.datetime "reset_password_sent_at"
    t.string "reset_password_token"
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "weekly_reviews", force: :cascade do |t|
    t.text "content", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.date "week_start", null: false
    t.index ["user_id", "week_start"], name: "index_weekly_reviews_on_user_id_and_week_start", unique: true
  end

  add_foreign_key "daily_memos", "users"
  add_foreign_key "habit_logs", "habits"
  add_foreign_key "habits", "users"
  add_foreign_key "tasks", "users"
  add_foreign_key "weekly_reviews", "users"
end
