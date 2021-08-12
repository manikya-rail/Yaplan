class ProjectBasicSerializer < ActiveModel::Serializer
  attributes :id, :title, :workflow

  has_one :created_by

  def workflow
    object.project_workflow.name if object.project_workflow.present?
  end
end
