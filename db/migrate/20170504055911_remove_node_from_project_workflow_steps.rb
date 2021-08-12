class RemoveNodeFromProjectWorkflowSteps < ActiveRecord::Migration[5.1]
  def change
    remove_column :project_workflow_steps, :node, :hstore
  end
end
