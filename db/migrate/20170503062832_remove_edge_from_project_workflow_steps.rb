class RemoveEdgeFromProjectWorkflowSteps < ActiveRecord::Migration[5.1]
  def change
    remove_column :project_workflow_steps, :edge, :hstore
  end
end
