class AddEdgeDetailsToProjectWorkflowSteps < ActiveRecord::Migration[5.1]
  def change
    add_column :project_workflow_steps, :edge, :hstore
  end
end
