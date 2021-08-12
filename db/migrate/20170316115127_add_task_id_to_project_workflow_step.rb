class AddTaskIdToProjectWorkflowStep < ActiveRecord::Migration[5.1]
  def change
    add_column :project_workflow_steps, :task_id, :integer
  end
end
