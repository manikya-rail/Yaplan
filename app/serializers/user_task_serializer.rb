class UserTaskSerializer < ActiveModel::Serializer
  attributes :id, :response_status, :task_id, :user_id, :task_type, :project_name, :re_issued, :created_at, :updated_at
  has_one :task

  def project_name
  	object.task.project.title
  end
  def re_issued
  	object.re_issued?
  end

end
