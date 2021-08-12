class SectionTextSerializer < ActiveModel::Serializer
  attributes :id, :created_at, :updated_at, :title, :content, :project_id
end
