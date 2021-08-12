class ProjectWorkflowIndexSerializer < ActiveModel::Serializer
  attributes :id, :name, :snapshot, :structure, :locked, :category, :description,
    :project_id, :workflow_template_id, :created_by, :project_name, :created_at, :updated_at
  belongs_to :project, serializer: ProjectIndexSerializer
  has_one :category
  has_one :created_by
  # def category
  #   object.project.category
  # end

  # def created_by
  #   if object.project.present?
  #     owner = object.project.created_by
  #     {"id": owner.id, "full_name": owner.full_name, "email": owner.email }
  #   end
  # end

  def project_name
    object.project.title
  end
end
