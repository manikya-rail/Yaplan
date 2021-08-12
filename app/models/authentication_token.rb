class AuthenticationToken < ActiveRecord::Base
  validates :user_id, presence: true
  belongs_to :user, optional: true
end
