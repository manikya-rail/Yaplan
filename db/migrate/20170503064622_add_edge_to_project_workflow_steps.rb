class AddEdgeToProjectWorkflowSteps < ActiveRecord::Migration[5.1]
  def change
    add_column :project_workflow_steps, :edge, :json
  end
end
