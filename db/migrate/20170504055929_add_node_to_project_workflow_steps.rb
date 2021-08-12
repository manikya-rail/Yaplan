class AddNodeToProjectWorkflowSteps < ActiveRecord::Migration[5.1]
  def change
    add_column :project_workflow_steps, :node, :json
  end
end
