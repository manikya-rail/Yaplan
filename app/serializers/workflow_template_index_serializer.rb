class WorkflowTemplateIndexSerializer < ActiveModel::Serializer
  attributes :id, :name, :snapshot, :structure,
             :description, :created_at, :updated_at, :published,
             :category_id, :is_public
  belongs_to :created_by
end
