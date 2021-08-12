class CategorySerializer < ActiveModel::Serializer
  attributes :id, :name, :image, :is_archived, :is_published, :created_at, :updated_at
end
