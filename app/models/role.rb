class Role < ActiveRecord::Base
  validates :name, uniqueness: true
  validates :name, presence: true
  has_many :users
end
