class RemoveStateColumnFromWorkflowTemplateStep < ActiveRecord::Migration[5.1]
  def change
    remove_column :workflow_template_steps, :state
  end
end
