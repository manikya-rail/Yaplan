class DasbordProjectSerializer < ActiveModel::Serializer
  attributes :id,:title,:role,:progress

  def progress
    tasks = object.tasks.joins(:project_workflow_steps).active
    total_task_count = tasks.count
    progress = total_task_count.zero? ? 0 : (tasks.approved.count.to_f / total_task_count)*100
    progress.round
  end

  def role
    (object.created_by == current_user) ? "Project Manager" : "User"
  end
end