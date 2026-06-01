class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :tasks, dependent: :destroy
  has_many :habits, dependent: :destroy
  has_many :daily_memos, dependent: :destroy
  has_many :weekly_reviews, dependent: :destroy
end
