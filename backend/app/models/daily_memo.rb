class DailyMemo < ApplicationRecord
  belongs_to :user

  validates :content, presence: true
  validates :target_date, uniqueness:{
    scope: :user_id, 
    message: "のメモはすでに作成されています"
  }
end

