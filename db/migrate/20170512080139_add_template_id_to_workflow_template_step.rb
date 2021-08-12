class AddTemplateIdToWorkflowTemplateStep < ActiveRecord::Migration[5.1]
  def change
  	    add_column :workflow_template_steps, :task_id, :integer
  end
end
