class ProjectSerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :created_at, :updated_at, :category_name, :category_id, :workflow, :start_at,:end_at, :archived, :created_tasks_count,:completed_tasks_count, :assigned_documents_count
  has_one :created_by
  has_many :collaborators
  has_one :project_workflow, serializer: ProjectWorkflowIndexSerializer

  def initialize(object,options={})
    super
    @workflow_tasks = object.tasks.active.joins(:project_workflow_steps) 
  end

  def workflow
    object.project_workflow.name if object.project_workflow.present?
  end

  def category_name
    object.category.name if object.category.present?
  end

  def created_tasks_count
    @workflow_tasks.count
  end

  def completed_tasks_count
    @workflow_tasks.approved.count
  end

  def assigned_documents_count
    @workflow_tasks.where(type: "Document").where.not(assigned_to: nil).count
  end
end
