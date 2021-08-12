class RemoveNodeFromWorkflowTemplateSteps < ActiveRecord::Migration[5.1]
  def change
    remove_column :workflow_template_steps, :node, :hstore
  end
end
