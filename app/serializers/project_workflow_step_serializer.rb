class ProjectWorkflowStepSerializer < ActiveModel::Serializer
  attributes :id, :step_id, :node_type, :node, :state, :parent_step_id, :next_step_id, :task, :communications, :project_workflow_id, :description
  #belongs_to :project_workflow
  #belongs_to :task
  has_many :communications

  def task
  	if object.task.present?
  		task = object.task
  		{
  			"id": task.id, 
  			"title": task.title,
  			"description": task.description,
  			"state": task.state,
  			"assigned_to_id": task.assigned_to_id,
  			"approver_id": task.approver_id,
  			"type": task.type,
        "attachments": task.attachments
  		}
  	end
  end
end
