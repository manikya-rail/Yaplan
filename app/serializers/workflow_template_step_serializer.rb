class WorkflowTemplateStepSerializer < ActiveModel::Serializer
  attributes :id, :step_id, :node_type, :node, :state, :parent_step_id, :next_step_id, :edge, :description, :communications, :task, :created_at, :updated_at, :workflow_template_id
  # belongs_to :task
  # belongs_to :workflow_template
  has_many :communications

  def task
  	if object.task.present?
  		task = object.task
  		{
  			"id": task.id, 
  			"title": task.title,
  			"description": task.description,
  			"state": task.state,
  			"is_public": task.is_public,
  			"is_template": task.is_template?,
  			"type": task.type,
        "attachments": task.attachments
  		}
  	end
  end
end
