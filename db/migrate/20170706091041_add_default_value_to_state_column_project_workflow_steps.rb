class AddDefaultValueToStateColumnProjectWorkflowSteps < ActiveRecord::Migration[5.1]
  def change
    change_column_default :project_workflow_steps, :state, 0
  end
  ProjectWorkflowStep.where(state: nil).update_all(state: 0)
end
