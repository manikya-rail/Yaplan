class ProjectIndexSerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :created_at, :updated_at, :category_name, :category_id, :workflow, :archived
  #has_many :documents, include: '*'
  has_one :created_by
  #has_many :collaborators
  # has_many :collaborations, embed: :ids, include: true
  #has_one :project_workflow

  def workflow
    object.project_workflow.name if object.project_workflow.present?
  end

  def category_name
    object.category.name if object.category.present?
  end


  def updated_at
    begin
      project_updated_at = object.updated_at
      last_updated_task_updated_at = object.recent_tasks.try(:first).try(:updated_at)
      (project_updated_at > last_updated_task_updated_at ? project_updated_at : last_updated_task_updated_at)
    rescue
      object.updated_at
    end
  end

end
