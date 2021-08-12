class ProjectWorkflowSerializer < ActiveModel::Serializer

  attributes :id, :name, :snapshot, :structure, :locked, :category, :description,
    :project_name, :project_id, :workflow_template_id, :project_workflow_steps 
  has_many :project_workflow_steps, serializer: ProjectWorkflowStepSerializer
  has_one :category

  def project_name
    object.project.title
  end

end
