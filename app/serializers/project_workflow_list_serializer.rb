class ProjectWorkflowListSerializer < ActiveModel::Serializer
  attributes :id, :name, :project_name

  def project_name
    object.project.try(:title)
  end

end
