class AddWorkflowTemplateStepReferenceToCommunication < ActiveRecord::Migration[5.1]
  def change
  	add_column :communications, :workflow_template_step_id, :integer
  end
end
