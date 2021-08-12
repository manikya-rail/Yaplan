class WorkflowTemplateSerializer < ActiveModel::Serializer
  attributes :id, :name, :snapshot, :structure, :workflow_template_steps,
             :description, :created_at, :updated_at, :published,
             :category_id, :is_public
  belongs_to :created_by
  has_many :workflow_template_steps, each_serializer: WorkflowTemplateStepSerializer

end
