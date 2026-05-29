user = User.find_or_create_by!(email: "user@todo.local") do |u|
  u.password = "password"
  u.password_confirmation = "password"
end

[
  { name: "起床・水を飲む",   category: :morning_routine },
  { name: "ストレッチ 5分",  category: :morning_routine },
  { name: "日記を書く",      category: :morning_routine },
  { name: "歯を磨く",        category: :night_routine   },
  { name: "入浴する",        category: :night_routine   },
  { name: "明日の準備をする", category: :night_routine  },
  { name: "読書 20分",       category: :general         },
].each do |attrs|
  user.habits.find_or_create_by!(name: attrs[:name], category: attrs[:category])
end

puts "Seeded: #{user.email}"
