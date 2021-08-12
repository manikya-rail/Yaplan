class PortraitSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :image
end
