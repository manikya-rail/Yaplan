class UserSerializer < ActiveModel::Serializer
  attributes :id, :full_name, :email, :portrait, :role,:country_code,:phone_number,:time_zone,:first_name,:last_name
  has_one :role
end
